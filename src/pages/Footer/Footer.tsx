import { FooterUI } from "@/shared/ui/footer"
import { useLocation, useNavigate } from "react-router-dom"



export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  if (location.pathname === '/registration') {
    return null
  }
  
  return (
    <FooterUI 
      onAboutClick={() => {navigate(`${import.meta.env.BASE_URL}/about`)}}
      onSkilsClick={() => {navigate(`${import.meta.env.BASE_URL}/skills`)}}
      onContactClick={() => {navigate(`${import.meta.env.BASE_URL}/contact`)}}
      onBlogClick={() => {navigate(`${import.meta.env.BASE_URL}/blog`)}}
      onPrivacyClick={() => {navigate(`${import.meta.env.BASE_URL}/privacy`)}}
      onAgreementClick={() => {navigate(`${import.meta.env.BASE_URL}/agreement`)}}
      onLogo={() => {navigate(`${import.meta.env.BASE_URL}/`, { replace: true })}}
    />
  )
}
