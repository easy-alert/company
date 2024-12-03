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
import { PopoverComponent } from '../Popover';

export const Sidebar = () => {
  const { signout } = useAuthContext();
  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(true);

  const SidebarContent: SidebarContentProps[] = [
    {
      title: 'Dashboard',
      type: 'navigate',
      icon: icon.dashboard,
      url: '/dashboard',
      redirectFunction: () => {
        navigate('/dashboard');
      },
    },
    {
      title: 'Calendário',
      type: 'navigate',
      icon: icon.calendar,
      url: '/calendar',
      redirectFunction: () => {
        navigate('/calendar');
      },
    },
    {
      title: 'Edificações',
      type: 'navigate',
      icon: icon.building,
      url: '/buildings',
      redirectFunction: () => {
        navigate('/buildings');
      },
    },

    {
      title: 'Checklists',
      type: 'navigate',
      icon: icon.checklists,
      url: '/checklists',
      redirectFunction: () => {
        navigate('/checklists');
      },
    },

    {
      title: 'Chamados',
      type: 'navigate',
      icon: icon.whiteSiren,
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
      redirectFunction: () => {
        //
      },
      options: [
        {
          label: 'Chamados',
          icon: icon.redDot,
          url: '/reports/tickets',
          redirectFunction: () => {
            navigate('/reports/tickets');
          },
        },

        {
          label: 'Checklists',
          icon: icon.redDot,
          url: '/reports/checklists',
          redirectFunction: () => {
            navigate('/reports/checklists');
          },
        },

        {
          label: 'Manutenções',
          icon: icon.redDot,
          url: '/reports/maintenances',
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
      url: '/suppliers',
      redirectFunction: () => {
        navigate('/suppliers');
      },
    },
    {
      title: 'Tutoriais',
      type: 'navigate',
      icon: icon.tutorial,
      url: '/tutorials',
      redirectFunction: () => {
        navigate('/tutorials');
      },
    },
    {
      title: 'Configurações',
      type: 'navigate',
      icon: icon.gear,
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

        <Style.ImageContainer>
          <Image width="44px" height="48px" radius="0px" img={icon.logoWhite} />
        </Style.ImageContainer>

        <Style.Hr />

        {SidebarContent.map((element, i: number) => (
          <React.Fragment key={element.url}>
            {i === SidebarContent.length - 1 && <Style.Spacer />}

            {element.type === 'navigate' && (
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

            {element.type === 'popover' && (
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
