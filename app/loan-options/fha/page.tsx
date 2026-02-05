import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect legacy or short URL /loan-options/fha to the canonical slug
  redirect('/loan-options/fha-home-loan')
}
