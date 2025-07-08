import Image from 'next/image'
import React from 'react'

export default function CommentForm() {
  const comments = [
    {
      id: "1",
      name: "Amina Hassan",
      comment: "Hongera sana Taifa Stars! Mmetufanya tujivunie kuwa Watanzania. Tunasubiri kuwaona mkipambana AFCON 2024.",
      time: "15 Jun 2023",
      avatar: "/avatar.webp"
    },
    {
      id: "2",
      name: "Munira Zubery",
      comment: "Kazi nzuri sana timu yetu ya taifa. Miaka 39 ni muda mrefu, lakini hatimaye tumefanikiwa. Tunatarajia matokeo mazuri zaidi AFCON.",
      time: "16 Jun 2023",
      avatar: "/avatar.webp"
    }
  ]

  return (
    <>
      <div className="mt-4 p-6  rounded-md ">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b last:border-0 pb-4 hover:bg-gray-50 transition-colors duration-200 p-3 rounded-md border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Image src={comment.avatar} alt={comment.name} className="w-10 h-10 rounded-full" width={40} height={40} />
                  <p className="font-medium text-gray-800">{comment.name}</p>
                </div>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="mt-2 text-gray-600 text-sm">{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>

        
      <form className="p-6 rounded-md text-gray-800">
        <h2 className="text-md font-black text-gray-800 mb-4  pb-2 border-b-gray-200 uppercase">Leave a Reply</h2>
        <div className="mb-4 flex flex-col md:flex-row gap-2">
          {/* <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
            Jina
          </label> */}
          <input
          placeholder='Full Name'
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:border-red-500 text-sm"
            required
          />

           <input
          placeholder='Your Email'
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:border-red-500 text-sm"
            required
          />
        </div>

        <div className="mb-2 md:mb-4">
          {/* <label htmlFor="comment" className="block text-sm text-gray-600 mb-1">
            Maoni
          </label> */}
          <textarea
          placeholder='Your Comment'
            id="comment"
            name="comment"
            rows={3}
            className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:border-red-500 text-sm resize-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className=" bg-red-600 text-white py-2 px-4 rounded-sm hover:bg-red-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
        >
          Tuma Maoni
        </button>
      </form>
    </>
  )
}
