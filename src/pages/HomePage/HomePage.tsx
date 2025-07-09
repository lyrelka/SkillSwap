import useSearch from "@/shared/hooks/useSearch"
import { CardPersonInfo } from "@/shared/lib/db/users/types"
import { FilterWidget } from "@/widgets/FilterWidget"
import { useState, useEffect} from "react"
import { useSearchParams } from "react-router-dom"
import styles from "./HomePage.module.css"
import { ActiveFilterUI } from "@/shared/ui/ActiveFilter"
import cross from "@/shared/assets/icons/cross_dark.svg";
import { readAllCategories } from "@/shared/lib/db/skills/utils"
import { TCategory } from "@/shared/lib/db/skills/types"
import { CardSkillsListComponent } from "@/widgets/CardSkillsList/CardSkillsList"
import { Preloader } from "@/shared/ui/Preloader"
import sortIcon from '@/shared/assets/icons/Icon left.svg'


export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const formatParams = searchParams.get('format') || '';
  const searchValue = searchParams.get('search') || '';
  const [filteredUsers, setFilteredUsers] = useState<CardPersonInfo[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<CardPersonInfo[]>([]);
  const [catalog, setCatalog] = useState<CardPersonInfo[]>([]);
  const [isFilterLoading, setIsFilterLoading] = useState<boolean>(true);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(true);
  const [isCatalogLoading, setIsCatalogLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [sortTitle, setSortTitle] = useState<'Сначала новые' | 'Сначала старые'>('Сначала новые');

  useEffect(() => {
    if (!isFilterLoading){
      setIsCatalogLoading(true);
      setIsSearchLoading(true);
      setSearchedUsers(useSearch(filteredUsers, formatParams, searchParams.get('search') || ''));
      setIsSearchLoading(false);
    }
    
    return () => {
      setSearchedUsers([]);
      setIsSearchLoading(true);
    }
  }, [filteredUsers, searchValue, formatParams])

  useEffect(() => {
    if (!isFilterLoading){
      if (searchValue && !isSearchLoading) {
        setCatalog(searchedUsers);
        setIsCatalogLoading(false);
      } else {
        setCatalog(filteredUsers);
        setIsCatalogLoading(false);
      }
    }
    
    return () => {
      setCatalog([]);
      setIsCatalogLoading(true);
    }
  }, [filteredUsers, searchedUsers])

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
  
  
  return (
    <div className={styles.content}>
      <FilterWidget 
        setFilteredUsers={setFilteredUsers}
        setIsFilterLoading={setIsFilterLoading}
        setIsCatalogLoading={setIsCatalogLoading}
      />
      <div className={styles.catalog}>
        {isCatalogLoading ? (
          <Preloader/>
        ):(
          <>
            {Array.from(searchParams.entries()).length > 0 ? (
              <>
                {Array.from(searchParams.entries()).filter(([key]) => key !== 'search').length > 0 && (
                  <div className={styles.filterActive_container}>
                    {Array.from(searchParams.entries()).map(([key, value]) => {
                      if (key !== 'search') {
                        let title: string | undefined = value;
                        if (key === 'format') {
                          if (value === 'wantToLearn') {
                            title = 'Хочу научиться'
                          } else {
                            title = 'Могу научить'
                          }
                        }

                        if (key === 'subсategory') {
                          title = categories.find(category => category.subcategory.some(sub => sub.id === Number(value))
                            )?.subcategory.find(sub => sub.id === Number(value))?.name;
                        }

                        return (
                          <ActiveFilterUI 
                            title={title} 
                            icon={cross} 
                            key={`${key}=${value}`}
                            onClick={() => {
                              searchParams.delete(key, value);
                              setSearchParams(searchParams);
                            }}
                          />
                        );
                      }
                    })}
                  </div>
                )}

                <div className={styles.heading_catalog}>
                  <h2 className={styles.title}>Подходящие предложения: {catalog.length}</h2>
                  {catalog.length > 0 && (
                    <button 
                      className={styles.sort_button}
                      onClick={() => {sortTitle === 'Сначала новые' ? setSortTitle('Сначала старые') : setSortTitle('Сначала новые')}}>
                        <img src={sortIcon} alt={sortTitle} className={styles.sort_icon} loading="lazy"/>
                      <p className={styles.sort_title}>{sortTitle}</p>
                    </button>
                  )}
                </div>
                <CardSkillsListComponent 
                  catalog={catalog}
                />
              </>
            ) : <>
              <h2 className={styles.title}>Рекомендуем</h2>
              <CardSkillsListComponent 
                catalog={catalog}/>
              </>
            }
          </>
        )}
      </div>
    </div>
  )
}
