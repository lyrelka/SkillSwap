import useDebounce from "@/shared/hooks/useDebounce";
import { TCategory } from "@/shared/lib/db/skills/types";
import { readAllCategories } from "@/shared/lib/db/skills/utils";
import { AllSkillsModal } from "@/shared/ui/AllSkillsModal";
import { HeaderUI } from "@/shared/ui/app-header"
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

export const Header = () => {
  const location = useLocation();
  
  if (location.pathname === `${import.meta.env.BASE_URL}/registration`) {
    return null
  }

  const [isSkillsModalVisible, setSkillsModalVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<TCategory[]>([]);
  useEffect(() => {
      readAllCategories().then(response => {
        setCategories(response);
      }).catch(error => {
        console.error('Получение данных о навыках', error);
      });
  
      return () => {
        setCategories([]);
      }
    }, [])

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue]= useState<string>(searchParams.get('search') || '');
  const searchDebounced= useDebounce(searchValue.trim(), 500);
  let redirectTimer: NodeJS.Timeout;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }

    if (searchDebounced) {
      redirectTimer = setTimeout(() => {
        if (location.pathname !== `${import.meta.env.BASE_URL}/`) {
          if (searchDebounced) {
            navigate(`${import.meta.env.BASE_URL}/?search=${searchDebounced}`, { replace: true });
            window.location.reload();
          }
        }
      }, 500)
    }

    return () => {
      clearTimeout(redirectTimer);
    }
  }, [searchDebounced])

  useEffect(() => {
    if (location.pathname === `${import.meta.env.BASE_URL}/`) {
      if (searchDebounced === ''){
        searchParams.delete('search');
        setSearchParams(searchParams);
      } else {
        searchParams.set('search', searchDebounced);
        setSearchParams(searchParams);
      }
    }

    return () => {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  }, [searchDebounced])

  return (
    <>
      <HeaderUI 
        isAuthenticated={false}
        onLogin={() => console.log('Login clicked')}
        onRegister={() => {navigate(`${import.meta.env.BASE_URL}/registration`, { replace: true })}}
        onThemeToggle={() => console.log('Theme toggle clicked')}
        onNotificationsClick={() => console.log('Notifications clicked')}
        onFavoritesClick={() => console.log('Favorites clicked')}
        onSkillsToggle={() => {
          setSkillsModalVisible(!isSkillsModalVisible);
        }}
        onLogo={() => {navigate(`${import.meta.env.BASE_URL}/`, { replace: true })}}
        onSearchChange={handleSearchChange}
        searchValue={searchValue}
      />
      <AllSkillsModal
        visible={isSkillsModalVisible}
        categories={categories}
        onClose={() => {
          setSkillsModalVisible(false);
        }}
      />
    </>
  )
}
