/**
 * Example: Using the Admin Style System
 * 
 * This demonstrates how to implement the organized admin styling
 * in components for consistent, maintainable code.
 */

import { adminButtonStyles, adminFormStyles, adminLayoutStyles, adminStatusStyles } from '@/lib/admin-styles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

export function ExampleAdminComponent() {
  return (
    // Use layout styles
    <div className={adminLayoutStyles.pageContainer}>
      <div className={adminLayoutStyles.contentArea}>
        
        {/* Page Header */}
        <div className={adminLayoutStyles.pageHeader}>
          <h1 className={adminLayoutStyles.pageTitle}>
            Example Admin Page
          </h1>
          <p className={adminLayoutStyles.pageDescription}>
            This demonstrates the organized admin style system
          </p>
        </div>

        {/* Main Content */}
        <div className={adminLayoutStyles.sectionSpacing}>
          
          {/* Form Card */}
          <Card className={adminLayoutStyles.card}>
            <CardHeader className={adminLayoutStyles.cardHeader}>
              <CardTitle className={adminLayoutStyles.cardTitle}>
                Settings Form
              </CardTitle>
              <p className={adminLayoutStyles.cardDescription}>
                Configure your preferences
              </p>
            </CardHeader>
            
            <CardContent className={adminLayoutStyles.cardContent}>
              {/* Form Fields */}
              <div className={adminLayoutStyles.elementSpacing}>
                
                {/* Input Example */}
                <div>
                  <Label className={adminFormStyles.label}>
                    Setting Name
                  </Label>
                  <Input 
                    className={adminFormStyles.input}
                    placeholder="Enter setting value"
                  />
                  <p className={adminFormStyles.helpText}>
                    This is helpful information about the setting
                  </p>
                </div>

                {/* Switch Example */}
                <div className="flex items-center space-x-2">
                  <Switch className={adminFormStyles.switch} />
                  <Label className={adminFormStyles.label}>
                    Enable feature
                  </Label>
                </div>

                {/* Status Badges Example */}
                <div>
                  <Label className={adminFormStyles.label}>
                    Status Examples
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={adminStatusStyles.badgeSuccess}>
                      Published
                    </Badge>
                    <Badge className={adminStatusStyles.badgeWarning}>
                      Pending Review
                    </Badge>
                    <Badge className={adminStatusStyles.badgeError}>
                      Failed
                    </Badge>
                    <Badge className={adminStatusStyles.badgeInfo}>
                      New Inquiry
                    </Badge>
                    <Badge className={adminStatusStyles.badgeDefault}>
                      Default Status
                    </Badge>
                  </div>
                </div>

              </div>
            </CardContent>

            <CardFooter className={adminLayoutStyles.cardFooter}>
              {/* Action Buttons */}
              <Button 
                variant="outline"
                className={adminButtonStyles.secondary}
              >
                Cancel
              </Button>
              <Button className={adminButtonStyles.primary}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  )
}

// Alternative: Using utility classes (once added to Tailwind config)
export function ExampleWithUtilities() {
  return (
    <div className="admin-page">
      <div className="admin-container">
        
        <div className="admin-header">
          <h1 className="admin-title">Example Page</h1>
          <p className="admin-description">Using utility classes</p>
        </div>

        <Card className="admin-card">
          <CardContent className="p-6">
            
            <Button className="admin-button-primary">
              Primary Action
            </Button>
            
            <Button className="admin-button-secondary">
              Secondary Action
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default ExampleAdminComponent
