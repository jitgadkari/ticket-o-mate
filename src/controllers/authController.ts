// src/controllers/authController.ts
import { Request, Response } from 'express'
import { supabase} from '../config/supabase'
import { prisma } from '../config/database'

export async function signUp(req: Request, res: Response) {
  const { email, password, name } = req.body
console.log(email, password, name)
  try {
    // Supabase sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
console.log(data, error)
    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        email,
        name,
        // Store Supabase user ID if needed
        id: data.user?.id
      }
    })
console.log(user)
    res.status(201).json({ user })
  } catch (err) {
    res.status(500).json({ error: 'Sign up failed' })
  }
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    res.json({
      user: data.user,
      session: data.session
    })
  } catch (err) {
    res.status(500).json({ error: 'Sign in failed' })
  }
}

export async function signInWithGoogle(req: Request, res: Response) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.CLIENT_URL}/auth/callback`
      }
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    // Return the URL where the client should redirect to complete Google OAuth
    res.json({ url: data.url })
  } catch (err) {
    res.status(500).json({ error: 'Google sign in failed' })
  }
}

export async function handleAuthCallback(req: Request, res: Response) {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session?.user) {
      return res.status(401).json({ error: error?.message || 'No session found' })
    }

    // Check if user exists in Prisma
    let user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.full_name || session.user.email!.split('@')[0]
        }
      })
    }

    res.json({
      user,
      session
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to handle authentication callback' })
  }
}