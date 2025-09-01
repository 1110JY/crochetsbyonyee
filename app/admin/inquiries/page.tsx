import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Mail, Clock, CheckCircle } from "lucide-react"

async function getInquiries() {
  const supabase = await createClient()

  const { data } = await supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries()
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
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                      >
                        Reply
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
    </div>
  )
}
