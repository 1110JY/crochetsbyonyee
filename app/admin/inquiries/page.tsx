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
    <div>
      <AdminHeader title="Customer Inquiries" description="Manage customer messages and requests" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-amber-900">All Inquiries</h2>
            <p className="text-amber-600">
              {inquiries.length} total inquiries • {unreadCount} unread
            </p>
          </div>
        </div>

        {inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-amber-600" />
                          <span className="font-semibold text-amber-900">{inquiry.name}</span>
                        </div>
                        <span className="text-amber-600">{inquiry.email}</span>
                        {!inquiry.is_read && <Badge className="bg-amber-600 text-white">New</Badge>}
                      </div>

                      {inquiry.subject && (
                        <h3 className="font-medium text-amber-900 mb-2">Subject: {inquiry.subject}</h3>
                      )}

                      <p className="text-amber-700 mb-4 leading-relaxed">{inquiry.message}</p>

                      <div className="flex items-center space-x-4 text-sm text-amber-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(inquiry.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {!inquiry.is_read && (
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
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
          <Card className="border-amber-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">No Inquiries Yet</h3>
              <p className="text-amber-600">Customer messages will appear here when they contact you.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
