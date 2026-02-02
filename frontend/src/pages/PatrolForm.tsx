import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { patrolService } from '../services/patrol.service';
import { siteService } from '../services/site.service';
import { Site, ItemStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

// 순찰일지 점검 항목 템플릿
const patrolTemplate = {
  '작업장일반': [
    '위험하게 적치되거나 방치된 자재 및 재료는 없는가?',
    '작업장이 통로는 확보되어 있으며 작업자가 충돌할 위험이 없는가?',
    '불안전한 상태의 시설물은 없는가?',
    '공기구 및 안전장구가 현장에 방치되어 있지 않은가?',
    '작업장 주변 정리정돈은 양호한가?',
  ],
  '작업자': [
    '작업복은 규정대로 착용하고 있는가?',
    '보호구의 규정대로 착용하고 있는가?',
    '불안전행동을 하지는 않는가?',
    '작업절차 및 신체가 점촉을 하지는 않는가?',
  ],
  '유해위험물': [
    '인화성·가연성 물질이 방치되어 있지 않은가?',
    '각종 가스 호스 및 게이지의 상태는 양호한가?',
    'MSDS 대상물질에 대한 교육은 실시하였는가?',
  ],
  '환경·시설물': [
    '위험 기계기구의 방호장치는 정상과 있는가?',
    '작업과 관련된 기계·기구의 이상유무',
    '소음·분진·조명등의 상태',
    '안전표지판의 상태',
    '소화시설의 상태',
  ],
  '기타': [
    '건선 및 각종 호스는 정리되어 사용하는가?',
    '중량물 운반시 작당 유도원은 배치되었는가?',
  ],
};

const PatrolForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  
  const [formData, setFormData] = useState({
    siteId: user?.siteId || '',
    inspectionDate: new Date().toISOString().split('T')[0],
    department: '',
    location: '',
    notes: '',
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchSites();
    initializeItems();
    
    if (id) {
      fetchPatrolLog();
    }
  }, [id]);

  const fetchSites = async () => {
    try {
      const data = await siteService.getSites();
      setSites(data);
    } catch (error) {
      console.error('Failed to fetch sites:', error);
    }
  };

  const initializeItems = () => {
    const itemsList: any[] = [];
    let itemNumber = 1;
    
    Object.entries(patrolTemplate).forEach(([category, questions]) => {
      questions.forEach((question) => {
        itemsList.push({
          category,
          itemNumber: itemNumber++,
          itemText: question,
          status: 'GOOD' as ItemStatus,
          notes: '',
        });
      });
    });
    
    setItems(itemsList);
  };

  const fetchPatrolLog = async () => {
    try {
      const data = await patrolService.getPatrolLog(id!);
      setFormData({
        siteId: data.site.id,
        inspectionDate: data.inspectionDate.split('T')[0],
        department: data.department,
        location: data.location,
        notes: data.notes || '',
      });
      setItems(data.items);
    } catch (error) {
      console.error('Failed to fetch patrol log:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        items,
      };

      if (id) {
        await patrolService.updatePatrolLog(id, data);
      } else {
        await patrolService.createPatrolLog(data);
      }

      navigate('/patrol');
    } catch (error: any) {
      console.error('Failed to save patrol log:', error);
      alert(error.response?.data?.error || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/patrol')}
          sx={{ mr: 2 }}
        >
          목록
        </Button>
        <Typography variant="h4">
          {id ? '순찰일지 수정' : '순찰일지 작성'}
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>사업소</InputLabel>
              <Select
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                disabled={!!user?.siteId}
              >
                {sites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="점검일"
              type="date"
              value={formData.inspectionDate}
              onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="부서"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="장소"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          점검 항목
        </Typography>
        
        {Object.keys(patrolTemplate).map((category) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', bgcolor: '#f5f5f5', p: 1 }}>
              {category}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="60%">점검 항목</TableCell>
                    <TableCell align="center" width="20%">양호/불량</TableCell>
                    <TableCell width="20%">비고</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items
                    .filter((item) => item.category === category)
                    .map((item, index) => {
                      const actualIndex = items.findIndex((i) => i === item);
                      return (
                        <TableRow key={actualIndex}>
                          <TableCell>{item.itemText}</TableCell>
                          <TableCell align="center">
                            <RadioGroup
                              row
                              value={item.status}
                              onChange={(e) => handleItemChange(actualIndex, 'status', e.target.value)}
                            >
                              <FormControlLabel value="GOOD" control={<Radio />} label="양호" />
                              <FormControlLabel value="BAD" control={<Radio />} label="불량" />
                            </RadioGroup>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              value={item.notes || ''}
                              onChange={(e) => handleItemChange(actualIndex, 'notes', e.target.value)}
                              placeholder={item.status === 'BAD' ? '상세 내용 입력 필수' : ''}
                              required={item.status === 'BAD'}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="특이사항"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate('/patrol')}>
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? '저장 중...' : '저장'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PatrolForm;
