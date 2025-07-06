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
      onAboutClick={() => console.log('About clicked')}
      onSkilsClick={() => console.log('Skills clicked')}
      onContactClick={() => console.log('Contact clicked')}
      onBlogClick={() => console.log('Blog clicked')}
      onPrivacyClick={() => console.log('Privacy clicked')}
      onAgreementClick={() => console.log('Agreement clicked')}
      onLogo={() => {navigate(`${import.meta.env.BASE_URL}/`, { replace: true })}}
    />
  )
}
