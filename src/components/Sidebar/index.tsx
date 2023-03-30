// LIBS
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// STYLES
import * as Style from './styles';
import { icon } from '../../assets/icons/index';

// COMPONENTS
import { Image } from '../Image';
import { IconButton } from '../Buttons/IconButton';

// TYPES
import { SidebarContentProps } from './utils/types';
import { useAuthContext } from '../../contexts/Auth/UseAuthContext';

export const Sidebar = () => {
  const { signout } = useAuthContext();
  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(true);

  const SidebarContent: SidebarContentProps[] = [
    {
      icon: icon.calendar,
      url: '/calendar',
      redirectFunction: () => {
        navigate('/calendar');
      },
    },
    {
      icon: icon.maintenances,
      url: '/maintenances',
      redirectFunction: () => {
        navigate('/maintenances');
      },
    },
    {
      icon: icon.building,
      url: '/buildings',
      redirectFunction: () => {
        navigate('/buildings');
      },
    },
    {
      icon: icon.report,
      url: '/report/create',
      redirectFunction: () => {
        navigate('/report/create');
      },
    },
    {
      icon: icon.gear,
      url: '/account',
      redirectFunction: () => {
        navigate('/account');
      },
    },
    {
      icon: icon.power,
      url: '/login',
      redirectFunction: () => {
        signout();
        navigate('/login');
      },
    },
  ];

  useEffect(() => {
    if (window.location.href.endsWith('/')) {
      navigate('/calendar');
    }
  }, []);

  return (
    <Style.Background>
      <Style.SidebarBodyMobile>
        <IconButton
          labelPos="bottom"
          icon={icon.list}
          onClick={() => {
            setAnimate(true);
            setOpenSidebar(true);
          }}
        />
        <Style.ImageMobile>
          <Image width="44px" height="48px" radius="0px" img={icon.logoWhite} />
        </Style.ImageMobile>
      </Style.SidebarBodyMobile>

      <Style.SidebarBody openSidebar={openSidebar}>
        <Style.CloseButtonMobile>
          <IconButton
            labelPos="bottom"
            icon={icon.xWhite}
            onClick={() => {
              setAnimate(false);
              setTimeout(() => {
                setOpenSidebar(false);
              }, 125);
            }}
          />
        </Style.CloseButtonMobile>

        <Style.ImageContainer>
          <Image width="44px" height="48px" radius="0px" img={icon.logoWhite} />
        </Style.ImageContainer>

        <Style.Hr />

        {SidebarContent.map((element, i: number) => (
          <React.Fragment key={element.url}>
            {i === SidebarContent.length - 1 && <Style.Spacer />}
            <IconButton
              opacity="0.5"
              icon={element.icon}
              onClick={() => {
                const checkKeyPress = window.event as KeyboardEvent;
                if (checkKeyPress?.ctrlKey) {
                  window.open(element.url, '_blank');
                } else if (openSidebar) {
                  setAnimate(false);
                  setTimeout(() => {
                    setOpenSidebar(false);
                    element.redirectFunction();
                  }, 125);
                } else {
                  element.redirectFunction();
                }
              }}
              onAuxClick={() => {
                if (openSidebar) {
                  setAnimate(false);
                  setTimeout(() => {
                    setOpenSidebar(false);
                    window.open(element.url, '_blank');
                  }, 125);
                } else {
                  window.open(element.url, '_blank');
                }
              }}
              selected={window.location.pathname.startsWith(element.url)}
            />
          </React.Fragment>
        ))}
      </Style.SidebarBody>

      {openSidebar && (
        <Style.MobileBackground
          animate={animate}
          onClick={() => {
            setAnimate(false);
            setTimeout(() => {
              setOpenSidebar(false);
            }, 125);
          }}
        />
      )}

      <Style.AppContent>
        <Outlet />
      </Style.AppContent>
    </Style.Background>
  );
};
