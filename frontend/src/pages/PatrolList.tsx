import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  CircularProgress,
  TextField,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { patrolService } from '../services/patrol.service';
import { PatrolLog } from '../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const PatrolList = () => {
  const [patrols, setPatrols] = useState<PatrolLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatrols();
  }, [startDate, endDate]);

  const fetchPatrols = async () => {
    try {
      const response = await patrolService.getPatrolLogs({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setPatrols(response.data);
    } catch (error) {
      console.error('Failed to fetch patrols:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await patrolService.deletePatrolLog(id);
      fetchPatrols();
    } catch (error) {
      console.error('Failed to delete patrol:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const getBadItemsCount = (patrol: PatrolLog) => {
    return patrol.items.filter(item => item.status === 'BAD').length;
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
        <Typography variant="h4">순찰일지</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patrol/new')}
        >
          새 순찰일지 작성
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="시작일"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="종료일"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>점검일</TableCell>
              <TableCell>사업소</TableCell>
              <TableCell>점검자</TableCell>
              <TableCell>부서</TableCell>
              <TableCell>장소</TableCell>
              <TableCell align="center">부적합</TableCell>
              <TableCell align="center">승인</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patrols.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              patrols.map((patrol) => (
                <TableRow key={patrol.id}>
                  <TableCell>
                    {format(new Date(patrol.inspectionDate), 'yyyy-MM-dd', { locale: ko })}
                  </TableCell>
                  <TableCell>{patrol.site.name}</TableCell>
                  <TableCell>{patrol.inspector.name}</TableCell>
                  <TableCell>{patrol.department}</TableCell>
                  <TableCell>{patrol.location}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getBadItemsCount(patrol)}
                      color={getBadItemsCount(patrol) > 0 ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={patrol.approved ? '승인' : '미승인'}
                      color={patrol.approved ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/patrol/${patrol.id}/edit`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/patrol/${patrol.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(patrol.id)}
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
    </Box>
  );
};

export default PatrolList;
