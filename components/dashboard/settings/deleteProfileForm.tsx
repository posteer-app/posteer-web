"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrentProfile, clearCurrentProfile } from "@/utils/profile"
import { createClient } from "@/utils/supabase/client"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function deleteProfileForm(){
    const profile = useCurrentProfile()
    const [input, setInput] = useState("")
    const supabase = createClient()
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)

    async function deleteProfile(){
        setIsRefreshing(true)

        const { error } = await supabase
            .from("profiles")
            .delete()
            .eq('id', profile!.uuid)

        if (error) {
            toast.error("error deleting profile")
            setIsRefreshing(false)
        } else {
            console.log("success")
            
            clearCurrentProfile()
            
            toast.success("successfully deleted profile")
            router.refresh()
            setIsRefreshing(false)
        }
    }

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile  
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        this will permanently delete {profile?.name}
                    </DialogDescription>
                </DialogHeader>

                <Label>type <code className="text-muted-foreground">{profile?.name}</code> below to confirm:</Label>
                <Input onChange={i => setInput(i.target.value)}/>

                <Button 
                    variant={input == profile?.name ? "destructive" : "default"} 
                    disabled={(input == profile?.name ? false : true) || (isRefreshing)} 
                    className={input == profile?.name ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} 
                    onClick={() => deleteProfile()}
                >
                    {isRefreshing && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    delete forever
                </Button>
            </DialogContent>
        </Dialog>
        
    )
}