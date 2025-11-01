import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Divider,
  Tooltip,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "@service/auth";
import { UserDTO } from "@dtos/user";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AddIcon from "@mui/icons-material/Add";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidthCollapsed = 80;
const drawerWidthExpanded = 260;

interface SubMenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  hasSubmenu: boolean;
  submenuItems?: SubMenuItem[];
}

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState<UserDTO | null>(() => AuthService.getCurrentUser());
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const getInitials = (name: string): string => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const menuItems: MenuItem[] = [
    {
      text: "Lotações",
      icon: <HomeIcon />,
      path: "/home",
      hasSubmenu: false,
    },
    {
      text: "Igrejas",
      icon: <LocationCityIcon />,
      path: "/igrejas",
      hasSubmenu: false,
    },
    {
      text: "Cadastrar",
      icon: <AddIcon />,
      path: "#",
      hasSubmenu: true,
      submenuItems: [
        { text: "Veículo", icon: <DriveEtaIcon />, path: "/cadastrar/veiculo" },
        { text: "Usuário", icon: <PersonIcon />, path: "/cadastrar/usuario" },
        { text: "Common", icon: <FolderIcon />, path: "/cadastrar/common" },
      ],
    },
  ];

  const handleLogout = () => {
    AuthService.logout();
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      if (!isExpanded) {
        setIsExpanded(true);
      }
      setOpenMenu(openMenu === item.text ? null : item.text);
    } else {
      navigate(item.path);
      setOpenMenu(null);
    }
  };

  const isSubmenuItemActive = (item: MenuItem): boolean => {
    if (!item.submenuItems) return false;
    return item.submenuItems.some(
      (subItem) => location.pathname === subItem.path
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
          boxSizing: "border-box",
          backgroundColor: "white",
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          transition: "width 0.3s ease",
          overflow: "hidden",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80px !important",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: isExpanded ? 56 : 48,
            height: isExpanded ? 56 : 48,
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            transition: "width 0.3s ease, height 0.3s ease",
          }}
        >
          <img
            src="/images/favicon.png"
            alt="CCB Logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
        {isExpanded && (
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64B6F7",
              "&:hover": {
                backgroundColor: "rgba(100, 182, 247, 0.1)",
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
        {!isExpanded && (
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64B6F7",
              "&:hover": {
                backgroundColor: "rgba(100, 182, 247, 0.1)",
              },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      <Box sx={{ flexGrow: 1, mt: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isSubmenuActive = isSubmenuItemActive(item);
            const isSubmenuOpen = openMenu === item.text;
            const itemIsActive = isActive || isSubmenuActive;

            return (
              <Box key={item.text}>
                <ListItem
                  disablePadding
                  sx={{ mb: 0.5, justifyContent: "center" }}
                >
                  <Tooltip
                    title={item.text}
                    placement="right"
                    arrow
                    disableHoverListener={isExpanded}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "#64B6F7",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          "& .MuiTooltip-arrow": {
                            color: "#64B6F7",
                          },
                        },
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleMenuClick(item)}
                      sx={{
                        mx: isExpanded ? 1.5 : 0,
                        borderRadius: 2,
                        backgroundColor: "transparent",
                        justifyContent: isExpanded ? "flex-start" : "center",
                        minWidth: isExpanded ? "auto" : drawerWidthCollapsed,
                        width: isExpanded ? "auto" : drawerWidthCollapsed,
                        "&:hover": {
                          backgroundColor: "rgba(100, 182, 247, 0.1)",
                        },
                        "& .MuiListItemIcon-root": {
                          color: itemIsActive
                            ? "#64B6F7"
                            : "rgba(0, 0, 0, 0.6)",
                          minWidth: isExpanded ? 40 : 0,
                          display: "flex",
                          justifyContent: "center",
                          transition: "color 0.2s ease",
                        },
                        "& .MuiListItemText-primary": {
                          color: "#212121",
                          fontWeight: itemIsActive ? 600 : 500,
                          opacity: isExpanded ? 1 : 0,
                          width: isExpanded ? "auto" : 0,
                          transition: "opacity 0.3s ease, width 0.3s ease",
                        },
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                {item.hasSubmenu && (
                  <Collapse
                    in={isSubmenuOpen && isExpanded}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.submenuItems?.map((subItem) => {
                        const isSubItemActive =
                          location.pathname === subItem.path;
                        return (
                          <Tooltip
                            key={subItem.text}
                            title={subItem.text}
                            placement="right"
                            arrow
                            disableHoverListener={isExpanded}
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: "#64B6F7",
                                  fontSize: "0.875rem",
                                  fontWeight: 500,
                                  "& .MuiTooltip-arrow": {
                                    color: "#64B6F7",
                                  },
                                },
                              },
                            }}
                          >
                            <ListItemButton
                              onClick={() => navigate(subItem.path)}
                              sx={{
                                pl: 6,
                                pr: 2,
                                py: 1,
                                mx: 1.5,
                                borderRadius: 1.5,
                                backgroundColor: "transparent",
                                "&:hover": {
                                  backgroundColor: "rgba(100, 182, 247, 0.08)",
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  color: isSubItemActive
                                    ? "#64B6F7"
                                    : "rgba(0, 0, 0, 0.6)",
                                  minWidth: 36,
                                  transition: "color 0.2s ease",
                                }}
                              >
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={subItem.text}
                                primaryTypographyProps={{
                                  fontSize: "0.875rem",
                                  color: "#212121",
                                  fontWeight: isSubItemActive ? 600 : 500,
                                }}
                                sx={{
                                  opacity: isExpanded ? 1 : 0,
                                  transition: "opacity 0.3s ease",
                                }}
                              />
                            </ListItemButton>
                          </Tooltip>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      <Box
        sx={{
          p: isExpanded ? 2 : 1,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tooltip
          title={`${user?.name || "Usuário"} - ${
            user?.email || "email@exemplo.com"
          }`}
          placement="top"
          disableHoverListener={isExpanded}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: 2,
              p: 1.5,
              justifyContent: isExpanded ? "flex-start" : "center",
              width: isExpanded ? "100%" : "auto",
              "&:hover": {
                backgroundColor: "rgba(100, 182, 247, 0.1)",
              },
            }}
            onClick={handleLogout}
          >
            <Avatar
              sx={{
                bgcolor: "#64B6F7",
                width: isExpanded ? 40 : 44,
                height: isExpanded ? 40 : 44,
                mr: isExpanded ? 2 : 0,
                fontWeight: 600,
                transition:
                  "width 0.3s ease, height 0.3s ease, margin 0.3s ease",
              }}
            >
              {user ? getInitials(user.name) : "U"}
            </Avatar>
            <Box
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                opacity: isExpanded ? 1 : 0,
                width: isExpanded ? "auto" : 0,
                transition: "opacity 0.3s ease, width 0.3s ease",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#212121",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name || "Usuário"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#757575",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {user?.email || "email@exemplo.com"}
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
