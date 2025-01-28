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