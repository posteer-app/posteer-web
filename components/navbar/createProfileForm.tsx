"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { z } from "zod"
import { Icons } from "../ui/icons"
import { toast } from "sonner"

interface createProfileDialogProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const profileSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(15, "Name must be less than 50 characters")
        .regex(/^[a-zA-Z0-9\s\-_]+$/, "Name can only contain letters, numbers, spaces, hyphens, and underscores")
})

export default function CreateProfileDialog({ open, setOpen }: createProfileDialogProps){
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState("")
    const [error, setError] = useState("")
    
    const validateInput = () => {
        try {
            profileSchema.parse({ name: input.trim() })
            setError("")
            return true
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.issues[0].message)
            }
            return false
        }
    }
    
    async function createProfile(){
        if (!validateInput()) return
        
        setIsLoading(true)
        setError("")
        
        try {
            const { data: { user }} = await supabase.auth.getUser()
            if(!user) throw new Error("No user found")
            
            const { error } = await supabase
                .from("profiles")
                .insert({ name: input.trim(), owner_id: user.id })
            
            if (error) throw error
            
            setInput("")
            setOpen(false)
            toast.success(`successfully created ${input.trim()}`)
            window.location.reload()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create profile")
        } finally {
            setIsLoading(false)
        }
    }

    const isValid = input.trim().length >= 2 && !error

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Profile</DialogTitle>
                    <DialogDescription>
                        This will act as a separate account
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); createProfile(); }} className="space-y-4">
                    <div>
                        <Label className="mb-3">profile name</Label>
                        <Input
                            id="profile-name"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onBlur={validateInput}
                            // placeholder="Enter profile name"
                            className={error ? "border-red-500" : ""}
                            disabled={isLoading}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                    <Button
                        type="submit"
                        disabled={!isValid || isLoading}
                        className="w-full"
                    >
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Create Profile
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}