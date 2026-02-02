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
import { saoService } from '../services/sao.service';
import { SAOReport } from '../types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const SAOList = () => {
  const [reports, setReports] = useState<SAOReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const fetchReports = async () => {
    try {
      const response = await saoService.getSAOReports({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch SAO reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await saoService.deleteSAOReport(id);
      fetchReports();
    } catch (error) {
      console.error('Failed to delete SAO report:', error);
      alert('삭제에 실패했습니다.');
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
        <Typography variant="h4">SAO (안전행동관찰)</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sao/new')}
        >
          새 SAO 작성
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
              <TableCell>관찰일</TableCell>
              <TableCell>사업소</TableCell>
              <TableCell>관찰자</TableCell>
              <TableCell>작업부서</TableCell>
              <TableCell>관찰지역</TableCell>
              <TableCell align="center">작업인원</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {format(new Date(report.reportDate), 'yyyy-MM-dd', { locale: ko })}
                  </TableCell>
                  <TableCell>{report.site.name}</TableCell>
                  <TableCell>{report.inspector.name}</TableCell>
                  <TableCell>{report.workplace}</TableCell>
                  <TableCell>{report.workArea}</TableCell>
                  <TableCell align="center">{report.workerCount}명</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/sao/${report.id}/edit`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/sao/${report.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(report.id)}
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

export default SAOList;
