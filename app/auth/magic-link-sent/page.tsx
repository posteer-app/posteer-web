import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MagicLinkSentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-[20rem] border-green-500 bg-green-50 text-green-800 mb-6 dark:border-green-600 dark:bg-green-900 dark:text-green-100">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">magic link sent</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-200">
            check your email to complete sign in
          </CardDescription>
        </CardHeader>
      </Card>
      <Link href="/">
        <Button className="w-full max-w-md">back to homepage</Button>
      </Link>
    </div>
  );
}