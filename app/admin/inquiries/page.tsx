"use client"

import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Mail, Clock, CheckCircle, Send, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Inquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  is_read: boolean
  replied: boolean
  replied_at: string | null
  reply_message: string | null
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    loadInquiries()
  }, [])

  const router = useRouter()
  
  const loadInquiries = async () => {
    setIsLoading(true)
    console.log('Loading inquiries...')
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error('Error loading inquiries:', error)
        toast.error('Failed to load inquiries')
        return
      }

      console.log('Loaded inquiries:', data?.length || 0)
      setInquiries(data || [])
    } catch (error) {
      console.error('Failed to load inquiries:', error)
      toast.error('Failed to load inquiries')
    } finally {
      setIsLoading(false)
    }
  }

  const [markingRead, setMarkingRead] = useState<{ [key: string]: boolean }>({})

  const handleDelete = async (inquiryId: string) => {
    if (!inquiryId) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("contact_inquiries")
        .delete()
        .eq("id", inquiryId)

      if (error) {
        console.error('Failed to delete inquiry:', error)
        toast.error('Failed to delete inquiry')
        return
      }

      toast.success('Inquiry deleted')
      await loadInquiries()
    } catch (error) {
      console.error('Error deleting inquiry:', error)
      toast.error('Failed to delete inquiry')
    }
  }

  const handleMarkRead = async (inquiryId: string) => {
    if (!inquiryId) {
      console.error('No inquiry ID provided')
      return
    }

    console.log('Starting mark as read for inquiry:', inquiryId)
    const supabase = createClient()
    
    try {
      // First verify the inquiry exists and check its current state
      const { data: inquiry, error: fetchError } = await supabase
        .from("contact_inquiries")
        .select("id, is_read")
        .eq("id", inquiryId)
        .single()

      if (fetchError) {
        console.error('Could not find inquiry:', fetchError)
        return
      }

      console.log('Current inquiry state:', inquiry)

      // Then update it
      const { data: updatedData, error: updateError } = await supabase
        .from("contact_inquiries")
        .update({ is_read: true })
        .eq("id", inquiryId)
        .select()

      if (updateError) {
        console.error('Failed to mark as read:', updateError)
        toast.error('Failed to mark as read')
        return
      }

      console.log('Update response:', updatedData)

      // If update successful, reload inquiries
      const { data: latestData, error: reloadError } = await supabase
        .from("contact_inquiries")
        .select("id, is_read")
        .eq("id", inquiryId)
        .single()

      console.log('Latest inquiry state after update:', latestData)

      if (!reloadError && latestData?.is_read) {
        toast.success('Marked as read')
        await loadInquiries()
      } else {
        console.error('Update may not have persisted:', reloadError || 'is_read is still false')
      }
    } catch (error) {
      console.error('Exception during mark as read:', error)
      toast.error('An error occurred')
    }
  }

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return

    setIsSending(true)
    try {
      const response = await fetch("/api/send-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedInquiry.email,
          subject: `Re: ${selectedInquiry.subject}`,
          message: replyText,
          inquiryId: selectedInquiry.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to send reply")

      toast.success("Reply sent successfully")
      
      // Update local state
      setInquiries(prevInquiries =>
        prevInquiries.map(inquiry =>
          inquiry.id === selectedInquiry.id
            ? {
                ...inquiry,
                replied: true,
                replied_at: new Date().toISOString(),
                reply_message: replyText,
              }
            : inquiry
        )
      )

      // Reset form
      setReplyText("")
      setSelectedInquiry(null)
    } catch (error) {
      toast.error("Failed to send reply. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <AdminHeader title="Customer Inquiries" description="Manage customer messages and requests" />
        <div className="max-w-7xl mx-auto px-8 py-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-r-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const unreadCount = inquiries.filter((inquiry) => !inquiry.is_read).length

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
                          onClick={() => handleMarkRead(inquiry.id)}
                          disabled={markingRead[inquiry.id]}
                        >
                          {markingRead[inquiry.id] ? (
                            <>
                              <div className="w-3 h-3 border-2 border-current border-r-transparent rounded-full animate-spin mr-1" />
                              Marking...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark Read
                            </>
                          )}
                        </Button>
                      )}
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground w-full"
                          onClick={() => setSelectedInquiry(inquiry)}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive/20 hover:border-destructive text-destructive hover:text-destructive w-full"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this inquiry?')) {
                              handleDelete(inquiry.id)
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {inquiry.replied && inquiry.reply_message && (
                    <div className="bg-muted/50 rounded-lg p-4 mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Your reply:</p>
                      <p className="text-sm text-muted-foreground">{inquiry.reply_message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sent on {new Date(inquiry.replied_at!).toLocaleString()}
                      </p>
                    </div>
                  )}
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

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Original message:</p>
              <p className="text-sm text-muted-foreground">{selectedInquiry?.message}</p>
            </div>
            <Textarea
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedInquiry(null)}
                className="border-primary/20 hover:border-primary/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={isSending || !replyText.trim()}
                className="bg-primary/90 hover:bg-primary text-primary-foreground"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
