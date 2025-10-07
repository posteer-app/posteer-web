"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { setCurrentProfile, Profile, useCurrentProfile } from "@/utils/profile"
import NewProfileDialog from "./newProfileDialog"

interface ComboboxProps {
  profiles?: Profile[]
}

export function Combobox({ profiles }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [newProfileDialogOpen, setNewProfileDialogOpen] = React.useState(false)
  const currentProfile = useCurrentProfile()
  const selectedUuid = currentProfile?.uuid || ""

  function onChangeProfile(profileUuid: string) {
    const profile = profiles?.find(p => p.uuid === profileUuid)
    if (profile) {
      setCurrentProfile(profile)
    }
    setOpen(false)
  }

  return (
    <>
      <NewProfileDialog open={newProfileDialogOpen} setOpen={setNewProfileDialogOpen}/>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`justify-between ${!selectedUuid ? "text-muted-foreground": ""}`}
          >
            {selectedUuid
              ? profiles?.find((profile) => profile.uuid === selectedUuid)?.name
              : "select profile"}
            <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="find profile..." />
            <CommandList>
              <CommandEmpty>no profile found</CommandEmpty>
              <CommandGroup>
                {profiles?.map((profile) => (
                  <CommandItem
                    key={profile.uuid}
                    value={profile.uuid}
                    onSelect={() => onChangeProfile(profile.uuid)}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUuid === profile.uuid ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {profile.name || `Profile ${profile.uuid.slice(0, 8)}`}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  value="new"
                  onSelect={() => {
                    // handle create-new flow
                    console.log("create new profile");
                    setNewProfileDialogOpen(true);
                    setOpen(false)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  new profile
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}