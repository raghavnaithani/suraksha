import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Home() {
  const auth = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome{auth.user ? `, ${auth.user.name}` : ''}!</h2>
          <p className="text-muted-foreground">Dashboard overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => auth.logout()}>Sign out</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Verification Terminal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Quick access to terminal</p>
            <div className="mt-4">
              <Link to="/verify">
                <Button>Open Terminal</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">View past verifications and reports</p>
            <div className="mt-4">
              <Link to="/verify/history">
                <Button variant="outline">Open History</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">System status and logs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
