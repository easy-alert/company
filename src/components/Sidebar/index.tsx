// REACT
import React, { useEffect, useState } from 'react';

// LIBS
import { Outlet, useNavigate } from 'react-router-dom';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// GLOBAL COMPONENTS
// COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { PopoverComponent } from '@components/Popover';

// GLOBAL ASSETS
import { icon } from '@assets/icons/index';

// TYPES
import type { SidebarContentProps } from './utils/types';

// STYLES
import * as Style from './styles';

export const Sidebar = () => {
  const { account, signout } = useAuthContext();

  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(true);

  const handlePermissions = (permission: string) => {
    const adminPermission = account?.User?.Permissions?.some(
      (perm) => perm.Permission.name === 'admin:company',
    );

    if (adminPermission) {
      return true;
    }

    return account?.User?.Permissions?.some((perm) => perm.Permission.name === permission);
  };

  const SidebarContent: SidebarContentProps[] = [
    {
      title: 'Dashboard',
      type: 'navigate',
      icon: icon.dashboard,
      permission: 'access:dashboard',
      url: '/dashboard',
      redirectFunction: () => {
        navigate('/dashboard');
      },
    },
    {
      title: 'Calendário',
      type: 'navigate',
      icon: icon.calendar,
      permission: 'access:calendar',
      url: '/calendar',
      redirectFunction: () => {
        navigate('/calendar');
      },
    },
    {
      title: 'Edificações',
      type: 'navigate',
      icon: icon.building,
      permission: 'access:buildings',
      url: '/buildings',
      redirectFunction: () => {
        navigate('/buildings');
      },
    },
    {
      title: 'Manutenções',
      type: 'navigate',
      icon: icon.maintenanceWhite,
      permission: 'access:maintenances',
      url: '/maintenances',
      redirectFunction: () => {
        navigate('/maintenances');
      },
    },

    {
      title: 'Checklists',
      type: 'navigate',
      icon: icon.checklists,
      permission: 'access:checklist',
      url: '/checklists',
      redirectFunction: () => {
        navigate('/checklists');
      },
    },

    {
      title: 'Chamados',
      type: 'navigate',
      icon: icon.whiteSiren,
      permission: 'access:tickets',
      url: '/tickets',
      redirectFunction: () => {
        navigate('/tickets');
      },
    },
    {
      title: 'Relatórios',
      label: 'Relatórios',
      type: 'popover',
      icon: icon.report,
      url: '/reports',
      permission: 'access:reports',
      redirectFunction: () => {
        //
      },
      options: [
        {
          label: 'Chamados',
          icon: icon.redDot,
          url: '/reports/tickets',
          permission: 'access:reports',
          redirectFunction: () => {
            navigate('/reports/tickets');
          },
        },

        {
          label: 'Checklists',
          icon: icon.redDot,
          url: '/reports/checklists',
          permission: 'access:reports',
          redirectFunction: () => {
            navigate('/reports/checklists');
          },
        },

        {
          label: 'Manutenções',
          icon: icon.redDot,
          url: '/reports/maintenances',
          permission: 'access:reports',
          redirectFunction: () => {
            navigate('/reports/maintenances');
          },
        },
      ],
    },
    {
      title: 'Fornecedores',
      type: 'navigate',
      icon: icon.suppliers,
      permission: 'access:suppliers',
      url: '/suppliers',
      redirectFunction: () => {
        navigate('/suppliers');
      },
    },
    {
      title: 'Tutoriais',
      type: 'navigate',
      icon: icon.tutorial,
      permission: 'access:tutorials',
      url: '/tutorials',
      redirectFunction: () => {
        navigate('/tutorials');
      },
    },
    {
      title: 'Configurações',
      type: 'navigate',
      icon: icon.gear,
      permission: 'access:account',
      url: '/account',
      redirectFunction: () => {
        navigate('/account');
      },
    },

    {
      title: 'Sair',
      type: 'navigate',
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
      navigate('/dashboard');
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

        <Style.ImageContainer
          onClick={() => {
            navigate('/home');
          }}
        >
          <Image width="44px" height="48px" radius="0px" img={icon.logoWhite} />
        </Style.ImageContainer>

        <Style.Hr />

        {SidebarContent.map((element, i: number) => (
          <React.Fragment key={element.url}>
            {i === SidebarContent.length - 1 && <Style.Spacer />}

            {element.type === 'navigate' &&
              (handlePermissions(element.permission!) || element.title === 'Sair') && (
                <IconButton
                  title={element.title}
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
              )}

            {element.type === 'popover' && handlePermissions(element.permission!) && (
              <PopoverComponent
                label={element.label}
                buttonChildren={
                  <IconButton
                    title={element.title}
                    opacity="0.5"
                    icon={element.icon}
                    onClick={() => {
                      //
                    }}
                    selected={window.location.pathname.startsWith(element.url)}
                  />
                }
                contentChildren={
                  <Style.ReportIcons>
                    {element.options?.map(({ icon: optionIcon, redirectFunction, url, label }) => (
                      <IconButton
                        size="6px"
                        labelPos="right"
                        key={url}
                        label={label}
                        icon={optionIcon}
                        onClick={() => {
                          const checkKeyPress = window.event as KeyboardEvent;
                          if (checkKeyPress?.ctrlKey) {
                            window.open(url, '_blank');
                          } else if (openSidebar) {
                            setAnimate(false);
                            setTimeout(() => {
                              setOpenSidebar(false);
                              redirectFunction();
                            }, 125);
                          } else {
                            redirectFunction();
                          }
                        }}
                        onAuxClick={() => {
                          if (openSidebar) {
                            setAnimate(false);
                            setTimeout(() => {
                              setOpenSidebar(false);
                              window.open(url, '_blank');
                            }, 125);
                          } else {
                            window.open(url, '_blank');
                          }
                        }}
                        selected={window.location.pathname.startsWith(url)}
                      />
                    ))}
                  </Style.ReportIcons>
                }
                position={['right', 'bottom']}
              />
            )}
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
