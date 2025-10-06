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

interface ComboboxProps {
  profiles?: {
    value: string,
    label: string
  }[]
}

export function Combobox({ profiles }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between ${!value ? "text-muted-foreground": ""}`}
        >
          {value
            ? profiles?.find((profile) => profile.label === value)?.label
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
                  key={profile.value}
                  value={profile.label}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === profile.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {profile.label}
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
                  setOpen(false);
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
  )
}