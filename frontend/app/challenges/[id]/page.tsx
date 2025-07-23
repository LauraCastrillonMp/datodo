"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Code, Clock, Trophy, Star, Lightbulb } from "lucide-react"

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/challenges')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Challenge #{params.id}</h1>
          <p className="text-muted-foreground">This challenge is coming soon!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenge Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    Beginner
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    15 min
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-gaming-gold" />
                  <span className="text-sm font-medium">50 XP</span>
                </div>
              </div>
              <CardTitle className="text-2xl">Array Operations Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <h3>Problem Description</h3>
                <p>
                  Implement a function that performs basic array operations including insertion, deletion, and searching.
                  Your function should handle edge cases and maintain optimal performance.
                </p>
                
                <h3>Requirements</h3>
                <ul>
                  <li>Implement an insert function that adds an element at a specific index</li>
                  <li>Implement a delete function that removes an element at a specific index</li>
                  <li>Implement a search function that finds an element and returns its index</li>
                  <li>Handle edge cases like empty arrays and invalid indices</li>
                </ul>

                <h3>Example</h3>
                <pre className="bg-muted p-4 rounded-lg">
{`const arr = [1, 2, 3, 4, 5];
insert(arr, 2, 10); // [1, 2, 10, 3, 4, 5]
delete(arr, 1);     // [1, 10, 3, 4, 5]
search(arr, 3);     // 2 (index of 3)`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Code Editor</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8 text-center">
                <Code className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Interactive Code Editor</h3>
                <p className="text-muted-foreground mb-4">
                  The code editor with syntax highlighting, auto-completion, and real-time testing will be available soon!
                </p>
                <Button disabled variant="outline">
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Time Remaining</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-gaming-purple">15:00</div>
                <p className="text-sm text-muted-foreground">minutes</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Test Case 1</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Test Case 2</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">Test Case 3</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Hints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>💡 Consider using array methods like splice() for insertions and deletions</p>
                <p>💡 Remember to handle edge cases like empty arrays</p>
                <p>💡 Use indexOf() or a loop for searching elements</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button disabled className="w-full">
                  <Code className="w-4 h-4 mr-2" />
                  Run Tests
                </Button>
                <Button disabled variant="outline" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Submit Solution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-gaming-purple/10 to-gaming-gold/10 border-gaming-purple/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Code className="w-16 h-16 mx-auto text-gaming-purple" />
            <h3 className="text-xl font-semibold">Interactive Challenges Coming Soon!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're building an amazing coding environment with real-time testing, syntax highlighting, and instant feedback. Get ready to test your data structure skills!
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/challenges')}>
                Back to Challenges
              </Button>
              <Button onClick={() => router.push('/theory')}>
                Learn Theory
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
