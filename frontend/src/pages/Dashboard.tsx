import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statsService } from '../services/stats.service';
import { DashboardStats } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await statsService.getDashboardStats({
        siteId: user?.role === 'SITE_MANAGER' ? user.siteId : undefined
      });
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography>데이터를 불러올 수 없습니다.</Typography>;
  }

  const statCards = [
    { title: '순찰일지', value: stats.summary.totalPatrols, icon: <AssignmentIcon />, color: '#1976d2' },
    { title: 'SAO 보고서', value: stats.summary.totalSAOs, icon: <VisibilityIcon />, color: '#2e7d32' },
    { title: '부적합 건수', value: stats.summary.badItemsCount, icon: <WarningIcon />, color: '#d32f2f' },
    { title: '양호 건수', value: stats.summary.goodItemsCount, icon: <CheckCircleIcon />, color: '#ed6c02' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>

      {/* 통계 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color, fontSize: 48 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* 관리감독자별 통계 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              관리감독자별 작성 현황
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.inspectorStats.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patrolCount" fill="#1976d2" name="순찰 건수" />
                <Bar dataKey="badItemsCount" fill="#d32f2f" name="부적합 건수" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 카테고리별 부적합 통계 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              주요 위험 유형 TOP 5
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>카테고리</TableCell>
                    <TableCell align="right">부적합 건수</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.categoryStats.slice(0, 5).map((item) => (
                    <TableRow key={item.category}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
