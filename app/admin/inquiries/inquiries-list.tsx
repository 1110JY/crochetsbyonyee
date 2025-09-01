"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Clock, CheckCircle, Send, X } from "lucide-react"
import { useState } from "react"
import { markInquiryAsRead, replyToInquiry } from "./actions"
import { toast } from "sonner"

interface Inquiry {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
  reply?: string
  replied_at?: string
  created_at: string
}

interface Props {
  initialInquiries: Inquiry[]
}

export default function InquiriesList({ initialInquiries }: Props) {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>({})
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyText, setReplyText] = useState("")

  const unreadCount = inquiries.filter((inquiry) => !inquiry.is_read).length

  const handleMarkAsRead = async (id: string) => {
    setIsProcessing((prev) => ({ ...prev, [id]: true }))
    
    try {
      const result = await markInquiryAsRead(id)
      console.log('Mark as read result:', result) // Debug log
      if (result.success && result.data) {
        setInquiries((prev) =>
          prev.map((inquiry) =>
            inquiry.id === id ? { ...inquiry, ...result.data } : inquiry
          )
        )
        toast.success("Marked as read")
      } else {
        toast.error("Failed to mark as read")
      }
    } catch (error) {
      console.error("Error marking as read:", error)
      toast.error("An error occurred")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleReplyClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setReplyText(inquiry.reply || "")
    setReplyDialogOpen(true)
  }

  const handleSendReply = async () => {
    if (!selectedInquiry) return

    setIsProcessing((prev) => ({ ...prev, [selectedInquiry.id]: true }))
    
    try {
      const { success } = await replyToInquiry(selectedInquiry.id, replyText)
      if (success) {
        setInquiries((prev) =>
          prev.map((inquiry) =>
            inquiry.id === selectedInquiry.id
              ? {
                  ...inquiry,
                  reply: replyText,
                  replied_at: new Date().toISOString(),
                  is_read: true
                }
              : inquiry
          )
        )
        setReplyDialogOpen(false)
        setSelectedInquiry(null)
        setReplyText("")
        toast.success("Reply sent")
      } else {
        toast.error("Failed to send reply")
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast.error("An error occurred")
    } finally {
      setIsProcessing((prev) => ({ ...prev, [selectedInquiry.id]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <AdminHeader title="Customer Inquiries" description="Manage customer messages and requests" />

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif font-light text-foreground">All Inquiries</h2>
            <p className="text-muted-foreground">
              {inquiries.length} total inquiries • {unreadCount} unread
            </p>
          </div>
        </div>

        {inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="bg-white/50 backdrop-blur-sm border-primary/20 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="font-serif text-foreground">{inquiry.name}</span>
                        </div>
                        <span className="text-muted-foreground">{inquiry.email}</span>
                        {!inquiry.is_read && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            New
                          </Badge>
                        )}
                      </div>

                      {inquiry.subject && (
                        <h3 className="font-medium text-foreground mb-2">Subject: {inquiry.subject}</h3>
                      )}

                      <p className="text-muted-foreground mb-4 leading-relaxed">{inquiry.message}</p>

                      {inquiry.reply && (
                        <div className="mb-4 pl-4 border-l-2 border-primary/20">
                          <p className="text-sm text-muted-foreground mb-1">Your reply:</p>
                          <p className="text-muted-foreground">{inquiry.reply}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sent on {new Date(inquiry.replied_at!).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {!inquiry.is_read && (
                        <Button 
                          size="sm" 
                          className="bg-primary/90 hover:bg-primary text-primary-foreground"
                          onClick={() => handleMarkAsRead(inquiry.id)}
                          disabled={isProcessing[inquiry.id]}
                        >
                          {isProcessing[inquiry.id] ? (
                            <div className="w-3 h-3 border-2 border-current border-r-transparent rounded-full animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                        onClick={() => handleReplyClick(inquiry)}
                        disabled={isProcessing[inquiry.id]}
                      >
                        {inquiry.reply ? "Edit Reply" : "Reply"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-light text-foreground mb-2">No Inquiries Yet</h3>
              <p className="text-muted-foreground mb-6">Customer messages will appear here when they contact you.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="bg-white/90 backdrop-blur-sm border-primary/20">
          <DialogHeader>
            <DialogTitle>Reply to {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">Original message:</p>
              <p className="text-muted-foreground pl-4 border-l-2 border-primary/20">
                {selectedInquiry?.message}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Your reply:</p>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-primary/20 hover:border-primary/30"
              onClick={() => setReplyDialogOpen(false)}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              className="bg-primary/90 hover:bg-primary text-primary-foreground"
              onClick={handleSendReply}
              disabled={!replyText.trim() || isProcessing[selectedInquiry?.id || ""]}
            >
              {isProcessing[selectedInquiry?.id || ""] ? (
                <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-1" />
              )}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
