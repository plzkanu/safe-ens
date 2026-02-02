import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/dashboard', roles: ['ADMIN', 'SITE_MANAGER', 'SUPERVISOR'] },
    { text: '순찰일지', icon: <AssignmentIcon />, path: '/patrol', roles: ['ADMIN', 'SITE_MANAGER', 'SUPERVISOR'] },
    { text: 'SAO', icon: <VisibilityIcon />, path: '/sao', roles: ['ADMIN', 'SITE_MANAGER', 'SUPERVISOR'] },
    { text: '통계', icon: <BarChartIcon />, path: '/statistics', roles: ['ADMIN', 'SITE_MANAGER'] },
    { text: '사용자 관리', icon: <PeopleIcon />, path: '/users', roles: ['ADMIN', 'SITE_MANAGER'] },
    { text: '사업소 관리', icon: <BusinessIcon />, path: '/sites', roles: ['ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const drawer = (
    <div>
      <Toolbar sx={{ flexDirection: 'column', py: 2, minHeight: 'auto !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <img 
            src="/logo.png" 
            alt="SOOSAN Logo" 
            style={{ height: 40, objectFit: 'contain' }}
          />
        </Box>
        <Typography variant="body2" noWrap component="div" color="text.secondary">
          안전순찰시스템
        </Typography>
      </Toolbar>
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {filteredMenuItems.find(item => item.path === location.pathname)?.text || ''}
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.name}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
