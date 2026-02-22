'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface NewsletterSignupProps {
  title?: string
  description?: string
  compact?: boolean
}

export default function NewsletterSignup({ 
  title = "Stay Informed",
  description = "Get the latest updates and news from Maricopa Senior Living delivered to your inbox.",
  compact = false
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    // TODO: Integrate with email service (Mailchimp, SendGrid, Resend, etc.)
    // For now, just simulate success
    setTimeout(() => {
      setStatus('success')
      setMessage('Thank you for subscribing!')
      setEmail('')
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }, 1000)
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1"
          aria-label="Email address"
        />
        <Button 
          type="submit" 
          disabled={status === 'loading' || status === 'success'}
          size="lg"
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </Button>
        {message && (
          <p className={`text-lg ${status === 'success' ? 'text-primary' : 'text-destructive'}`} role="alert">
            {message}
          </p>
        )}
      </form>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1"
            aria-label="Email address"
          />
          <Button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            size="lg"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </form>
        {message && (
          <p className={`mt-3 text-lg ${status === 'success' ? 'text-primary' : 'text-destructive'}`} role="alert">
            {message}
          </p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  )
}
