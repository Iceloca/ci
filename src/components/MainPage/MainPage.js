'use client';

import React, {
  useContext,
  useRef,
  useState,
  useCallback,
  lazy,
  Suspense,
} from 'react';

import styles from './MainPage.module.css';
// import CreatePost from '@/components/CreatePost/CreatePost';
// import Sidebar from '../Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
// import OverlayMenu from '../OverlayMenu/OverlayMenu';
// import Postsql from '../Posts/PostsGraphql';

import { MenuContext } from '@/providers/MenuContext';
import { DeviceContext } from '@/providers/DeviceProvider';
import { useSelector } from 'react-redux';
import useOnClickOutside from '@/hooks/useOnClickOutside';

// const CreatePostForm = lazy(() => import('../CreatePostForm/CreatePostForm'));

export default function MainPage() {
  // const { user } = useSelector((state) => state.auth);
  // const { isMenuOpen, toggleMenuMode } = useContext(MenuContext);
  // const isMobile = useContext(DeviceContext);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [refreshKey, setRefreshKey] = useState(0);
  // const menuNode = useRef(null);

  // useOnClickOutside(menuNode, () => {
  //   if (isMenuOpen) {
  //     toggleMenuMode();
  //   }
  // });

  // const handlePostCreated = () => {
  //   setRefreshKey((prev) => prev + 1);
  // };

  // const openModal = useCallback(() => setIsModalOpen(true), []);

  const themeClass = 'light';
    // user?.theme === 'light' ? 'light-theme-light' : 'dark-theme-light';

  return (
    <>
      <div className={`${themeClass} page`}>
        {/* <Header isRegiPage={false} /> */}
        <main className={styles.mainContainer}>
          {/* {isModalOpen && (
            <Suspense fallback={null}>
              <CreatePostForm
                closeModal={() => setIsModalOpen(false)}
                onSuccess={handlePostCreated}
              />
            </Suspense>
          )} */}
          {/* <CreatePost openModal={openModal} /> */}
          {/* <Postsql refreshKey={refreshKey} />
          {isAuthenticated && <Sidebar />} */}
        </main>
        <Footer />
      </div>
      {/* {isMenuOpen && isMobile && <OverlayMenu ref={menuNode} />} */}
    </>
  );
}
