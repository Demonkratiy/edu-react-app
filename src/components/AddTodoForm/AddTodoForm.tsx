import { useState, type SubmitEvent } from 'react'
import { Button, Input } from '@/components/ui'

interface AddTodoFormProps {
  onAdd: (text: string) => void
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
    const [text, setText] = useState('')    
    const trimmedText = text.trim();
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (trimmedText === '') return
        onAdd(trimmedText)
        setText('')
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-start gap-2 w-full max-w-md">
            <Input
                className="flex-1"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new todo"
            />
            <Button type="submit" disabled={trimmedText === ''}>Add</Button>
        </form>
    )
}
