import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { userService } from '../services/user.service';
import { siteService } from '../services/site.service';
import { User, Site, UserRole } from '../types';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'SUPERVISOR' as UserRole,
    siteId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, sitesData] = await Promise.all([
        userService.getUsers(),
        siteService.getSites(),
      ]);
      setUsers(usersData);
      setSites(sitesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        name: user.name,
        role: user.role,
        siteId: user.siteId || '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'SUPERVISOR',
        siteId: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data: any = {
        ...formData,
        siteId: formData.siteId || undefined,
      };

      if (editingUser) {
        // 수정 시 비밀번호가 비어있으면 제외
        if (!data.password) {
          delete data.password;
        }
        await userService.updateUser(editingUser.id, data);
      } else {
        await userService.createUser(data);
      }

      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      console.error('Failed to save user:', error);
      alert(error.response?.data?.error || '저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await userService.deleteUser(id);
      fetchData();
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      alert(error.response?.data?.error || '삭제에 실패했습니다.');
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      ADMIN: '통합 관리자',
      SITE_MANAGER: '사업소 관리자',
      SUPERVISOR: '관리감독자',
    };
    return labels[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      ADMIN: 'error',
      SITE_MANAGER: 'warning',
      SUPERVISOR: 'primary',
    };
    return colors[role] as any;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">사용자 관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          사용자 추가
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>이메일</TableCell>
              <TableCell>역할</TableCell>
              <TableCell>사업소</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.site?.name || '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 사용자 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingUser ? '사용자 수정' : '사용자 추가'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                required
                label="이름"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                fullWidth
                required
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                fullWidth
                required={!editingUser}
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                helperText={editingUser ? '변경하지 않으려면 비워두세요' : ''}
              />
              <FormControl fullWidth required>
                <InputLabel>역할</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <MenuItem value="ADMIN">통합 관리자</MenuItem>
                  <MenuItem value="SITE_MANAGER">사업소 관리자</MenuItem>
                  <MenuItem value="SUPERVISOR">관리감독자</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>사업소</InputLabel>
                <Select
                  value={formData.siteId}
                  onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                >
                  <MenuItem value="">없음</MenuItem>
                  {sites.map((site) => (
                    <MenuItem key={site.id} value={site.id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>취소</Button>
            <Button type="submit" variant="contained">
              저장
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
