"use client"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrentProfile } from "@/utils/profile"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"
import { toast } from "sonner"

export default function deleteProfileForm(){
    const profile = useCurrentProfile()
    const [input, setInput] = useState("")
    const supabase = createClient()

    async function deleteProfile(){
        const { error } = await supabase
            .from("profiles")
            .delete()
            .eq('id', profile!.uuid); // Filter by the 'id' column

        if (error) {
            console.log("error")
            toast.error("error deleting profile")
        } else {
            console.log("success")
            toast.success("successfully deleted profile");
        }
    }

    return(
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                this will permanently delete {profile?.name}
            </DialogDescription>
            </DialogHeader>
            <Label>type <code className="text-muted-foreground">{profile?.name}</code> below to confirm:</Label>
            <Input onChange={(input) => setInput(input.target.value)}/>
            <Button 
                variant={input == profile?.name ? "destructive" : "default"} 
                disabled={input == profile?.name ? false : true} 
                className="hover:cursor-pointer"
                onClick={() => deleteProfile()}
            >
                delete forever
            </Button>
        </DialogContent>
    )
}