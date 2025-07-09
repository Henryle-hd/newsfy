import { Suspense } from 'react'
import SignIn from './SignInForm'


export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  )
}
