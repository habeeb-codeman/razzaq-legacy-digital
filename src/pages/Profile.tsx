import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Shield, User, LogOut, Key } from 'lucide-react';
import SEO from '@/components/SEO';

const Profile = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!
      });

      if (error) throw error;
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 py-12 px-4">
      <SEO 
        title="My Account - Profile Settings"
        description="Manage your account settings and profile information"
      />
      
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground">My Account</h1>
              <p className="text-muted-foreground mt-2">Manage your profile and security settings</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Account Info Card */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5 border border-border/20">
                  <Mail className="w-5 h-5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                  {!user.email_confirmed_at && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={isResendingEmail}
                    >
                      {isResendingEmail ? 'Sending...' : 'Verify Email'}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5 border border-border/20">
                  <Shield className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-foreground font-medium">
                        {isAdmin ? 'Administrator' : 'User'}
                      </p>
                      {user.email_confirmed_at ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Min 8 characters, 1 uppercase, 1 special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    minLength={8}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-hero" 
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Admin Dashboard</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Access the admin panel to manage products
                    </p>
                  </div>
                  <Button onClick={() => navigate('/admin')} className="btn-hero">
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
