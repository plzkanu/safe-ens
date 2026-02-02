import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { statsService } from '../services/stats.service';
import { siteService } from '../services/site.service';
import { Site } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [complianceData, setComplianceData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any>(null);
  const [nonCompliantUsers, setNonCompliantUsers] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (sites.length > 0) {
      fetchStats();
    }
  }, [selectedSite, sites]);

  const fetchSites = async () => {
    try {
      const data = await siteService.getSites();
      setSites(data);
      
      if (user?.role === 'SITE_MANAGER' && user.siteId) {
        setSelectedSite(user.siteId);
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const params = selectedSite ? { siteId: selectedSite } : {};
      
      const [compliance, trend, nonCompliant] = await Promise.all([
        statsService.getComplianceRate(params),
        statsService.getMonthlyTrend(params),
        statsService.getNonCompliantUsers(params),
      ]);

      setComplianceData(compliance);
      setTrendData(trend);
      setNonCompliantUsers(nonCompliant);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">통계</Typography>
        
        {user?.role === 'ADMIN' && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>사업소</InputLabel>
            <Select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              {sites.map((site) => (
                <MenuItem key={site.id} value={site.id}>
                  {site.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* 순찰 실시율 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              관리감독자별 순찰 실시율
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>관리감독자</TableCell>
                    <TableCell align="center">순찰 건수</TableCell>
                    <TableCell align="center">기대 건수</TableCell>
                    <TableCell align="center">실시율</TableCell>
                    <TableCell align="center">상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceData?.data.map((item: any) => (
                    <TableRow key={item.supervisor.id}>
                      <TableCell>{item.supervisor.name}</TableCell>
                      <TableCell align="center">{item.patrolCount}</TableCell>
                      <TableCell align="center">{item.expectedCount}</TableCell>
                      <TableCell align="center">{item.complianceRate.toFixed(1)}%</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.isCompliant ? '이행' : '미이행'}
                          color={item.isCompliant ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* 월별 추이 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              월별 순찰 추이
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData?.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patrolCount" stroke="#1976d2" name="순찰 건수" />
                <Line type="monotone" dataKey="badCount" stroke="#d32f2f" name="부적합 건수" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* 미작성자 리스트 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              금주 미작성자
            </Typography>
            {nonCompliantUsers?.nonCompliantUsers.length === 0 ? (
              <Typography color="text.secondary">모든 관리감독자가 순찰일지를 작성했습니다.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell>이메일</TableCell>
                      <TableCell>사업소</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nonCompliantUsers?.nonCompliantUsers.map((item: any) => (
                      <TableRow key={item.user.id}>
                        <TableCell>{item.user.name}</TableCell>
                        <TableCell>{item.user.email}</TableCell>
                        <TableCell>{item.user.site?.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;
