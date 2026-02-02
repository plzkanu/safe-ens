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
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { siteService } from '../services/site.service';
import { Site } from '../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const SiteManagement = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    description: '',
  });

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const data = await siteService.getSites();
      setSites(data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (site?: Site) => {
    if (site) {
      setEditingSite(site);
      setFormData({
        name: site.name,
        code: site.code,
        address: site.address || '',
        description: site.description || '',
      });
    } else {
      setEditingSite(null);
      setFormData({
        name: '',
        code: '',
        address: '',
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSite(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSite) {
        await siteService.updateSite(editingSite.id, formData);
      } else {
        await siteService.createSite(formData);
      }

      handleCloseDialog();
      fetchSites();
    } catch (error: any) {
      console.error('Failed to save site:', error);
      alert(error.response?.data?.error || '저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await siteService.deleteSite(id);
      fetchSites();
    } catch (error: any) {
      console.error('Failed to delete site:', error);
      alert(error.response?.data?.error || '삭제에 실패했습니다.');
    }
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
        <Typography variant="h4">사업소 관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          사업소 추가
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>사업소명</TableCell>
              <TableCell>코드</TableCell>
              <TableCell>주소</TableCell>
              <TableCell>설명</TableCell>
              <TableCell>등록일</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.code}</TableCell>
                  <TableCell>{site.address || '-'}</TableCell>
                  <TableCell>{site.description || '-'}</TableCell>
                  <TableCell>
                    {format(new Date(site.createdAt), 'yyyy-MM-dd', { locale: ko })}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(site)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(site.id)}
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

      {/* 사업소 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingSite ? '사업소 수정' : '사업소 추가'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                required
                label="사업소명"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                fullWidth
                required
                label="코드"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={!!editingSite}
                helperText={editingSite ? '코드는 수정할 수 없습니다' : ''}
              />
              <TextField
                fullWidth
                label="주소"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="설명"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
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

export default SiteManagement;
