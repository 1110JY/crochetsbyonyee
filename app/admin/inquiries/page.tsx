"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Mail, Clock, CheckCircle, Send, Trash2, MessageSquare, Eye } from "lucide-react"
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
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        toast.error('Failed to load inquiries')
        return
      }

      setInquiries(data || [])
    } catch (error) {
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
        toast.error('Failed to delete inquiry')
        return
      }

      toast.success('Inquiry deleted')
      await loadInquiries()
    } catch (error) {
      toast.error('Failed to delete inquiry')
    }
  }

  const handleMarkRead = async (inquiryId: string) => {
    if (!inquiryId) {
      return
    }

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
      <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-r-slate-900 rounded-full animate-spin mr-3" />
            <span className="text-slate-600">Loading inquiries...</span>
          </div>
        </div>
      </div>
    )
  }

  const unreadCount = inquiries.filter((inquiry) => !inquiry.is_read).length

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-6 bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Customer Inquiries</h1>
            <p className="text-slate-600 mt-1">Manage customer messages and support requests</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="text-sm text-slate-600 flex items-center">
              <span className="font-medium">{inquiries.length}</span>
              <span className="ml-1">inquiries total</span>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      {inquiries.length > 0 ? (
        <div className="space-y-4 md:space-y-6">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-900">{inquiry.name}</span>
                      </div>
                      <span className="text-slate-600 text-sm">{inquiry.email}</span>
                      {!inquiry.is_read && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                          New
                        </Badge>
                      )}
                      {inquiry.replied && (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                          Replied
                        </Badge>
                      )}
                    </div>

                    {inquiry.subject && (
                      <h3 className="font-medium text-slate-900 mb-2">Subject: {inquiry.subject}</h3>
                    )}

                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">{inquiry.message}</p>

                    <div className="flex items-center space-x-4 text-sm text-slate-500">
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
                        className="bg-slate-900 hover:bg-slate-800 text-white"
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
                        className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 w-full"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 w-full"
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
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <Send className="w-3 h-3 mr-1" />
                      Your reply:
                    </p>
                    <p className="text-sm text-slate-600 mb-2">{inquiry.reply_message}</p>
                    <p className="text-xs text-slate-500">
                      Sent on {new Date(inquiry.replied_at!).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white border-slate-200">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No inquiries yet</h3>
            <p className="text-slate-600 mb-6">Customer messages and support requests will appear here when they contact you.</p>
          </CardContent>
        </Card>
      )}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Reply to {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">Original message:</p>
              <p className="text-sm text-slate-600">{selectedInquiry?.message}</p>
            </div>
            <Textarea
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
              className="border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSelectedInquiry(null)}
                className="border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={isSending || !replyText.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white"
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
