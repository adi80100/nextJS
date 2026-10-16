"use client"

import { acceptMsgSchema } from "@/app/schemas/acceptMsgSchema"
import MsgCard from "@/components/MsgCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import { ApiResponse } from "@/types/ApiRespone"
import { Separator } from "@base-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"


const page = () => {
  // for messae
  const [messages,setMessages] = useState<any[]>([])
  // laoding the message
  const [isLoading,setLoading] = useState(false)
  // for btn while deleteing the msg
  const [switchLoading,setSwitchLoading] = useState(false)


  const handleDeleteMsg = (messageId:string)=>{
    setMessages(messages.filter((m)=>String(m._id)!==messageId))
  }

  const {data:session} = useSession()

  const form = useForm({
    resolver:zodResolver(acceptMsgSchema),
     defaultValues: {
    acceptMessage: false,
  },

  })

  const {register,watch,setValue} = form

  const acceptMessage = watch('acceptMessage')

  const fetchAcceptMsg = useCallback(async()=>{
    setSwitchLoading(true)
    try {
     const response =  await axios.get<ApiResponse>('/api/accept-msg')
    setValue('acceptMessage',response.data.isAcceptingMessage ?? false)

    } catch (error) {
        console.log(error)
      const axiosError =  error as AxiosError<ApiResponse>
      console.log("error 1:",axiosError.response?.data.message)

      toast.add({
        title:"Error",
        description: axiosError.response?.data.message ||  "failed to fetch message setting"
      })

    }
    finally{
      setSwitchLoading(false)
    }
  },[setValue])


  const fetchMessages = useCallback(async(refresh:boolean=false)=>{
    setLoading(true)

    try {
      const response = await axios.get('/api/get-msg')
      setMessages(response.data.messages||[])
      if(refresh){
        toast.add({
          title:"Error",
          description:"Showing latest messages"
        })
      }
    } catch (error) {
      console.log("error",error)
      const axiosError =  error as AxiosError<ApiResponse>
            console.log("error 2:",axiosError.response?.data.message)

      toast.add({
        title:"Error",
        description: axiosError.response?.data.message ||  "failed to fetch message setting"
      })
    }
finally{
      setSwitchLoading(false)
      setLoading(false)
    }
    

  },[setLoading,setMessages])

  useEffect(()=>{
    if(!session||!session.user) return 

    fetchMessages()
    // msg state
    fetchAcceptMsg()

  },[session,setValue,fetchAcceptMsg,fetchMessages])

  // handle swithc change
  const handleSwitchChange= async()=>{
    try {
    const response =   await axios.post<ApiResponse>('/api/accept-msg',{
        acceptMessage : !acceptMessage
      })
      setValue('acceptMessage',!acceptMessage)

      console.log(response.data.message)
      toast.add({
        title:response.data.message,
      })

    } catch (error) {
      console.log(error)
      const axiosError =  error as AxiosError<ApiResponse>

      console.log("error 3:",axiosError.response?.data.message)
      toast.add({
        title:"Error",
        description: axiosError.response?.data.message ||  "failed to fetch message setting"
      })
    }
  }

  const username = session?.user?.username
const [baseUrl,setBaseUrl] = useState("")

useEffect(()=>{
  setBaseUrl(window.location.origin)
},[])
  // const baseUrl = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl)

    toast.add({
      title:"Url copied",
      description:"Profile url has copied to clipboard"
    })
  }

  if(!session || !session.user){
    return <div>
      Please login
    </div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={switchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MsgCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMsg}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page
