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
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { saoService } from '../services/sao.service';
import { siteService } from '../services/site.service';
import { Site } from '../types';
import { useAuth } from '../contexts/AuthContext';

// SAO 체크리스트 템플릿
const saoTemplate = {
  '작업자의 반응': [
    '개인보호구를 착용하거나 조정함',
    '작업자세를 바꿈',
    '작업방법을 고침',
    '작업을 중단하거나 자리를 옮김',
    '안전조치를 함(걸치, 안전난간 설치 등)',
    '기타',
  ],
  '개인보호구': [
    '머리(안전모)',
    '눈·귀·얼굴(보안경, 보안면등)',
    '귀(귀마개, 귀덮개)',
    '호흡기(방진, 방독마스크, 공기호흡기 등)',
    '손·팔(가죽, 절연, 방열, 고무장갑 등)',
    '몸통(안전벨트, 방열복, 보호의)',
    '다리와 발(안전화, 각반, 장화)',
    '기타',
  ],
  '작업자의 위치와 자세': [
    '협착(끼이거나 허점체에 달림들)',
    '추락(높은곳에서 사람이 떨어짐)',
    '진도(낙인·비탈·미끄러짐 등)',
    '낙하·비래(작업자가 맞음)',
    '충돌(경기틀에 부딛힘)',
    '감전(전기에 종격을 받음)',
    '고온이나 저은에 접촉',
    '유해물 접촉(가스질식/중독)',
    '산소결핍',
    '무리한동작(무거운 물건)',
    '화재,폭발(가연성,인화성물질 주변)',
    '기타',
  ],
  '작업도구/장비': [
    '부적합한 도구 및 장비사용',
    '작업도구와 장비 사용방법 불량',
    '도구나 장비가 불안전한 상태로 방치',
    '기타',
  ],
  '작업절차': [
    '작업표준이 없음',
    '작업표준이 없고 지키지 않음',
    '작업표준이 있으나 지키지 않음',
    '작업표준을 물라 지키지 않음',
    '작업표준을 알고 있으나 지키지 않음',
    '작업표준이 있으나 작업에 적합하지않음',
    'TBM(or PJB) 진전 미 참여 및 결과 미흡',
    '기타',
  ],
  '정리정돈/기준': [
    '정리정돈 기준이 없고 정리정돈미흡',
    '기준을 알고 있으나 정리정돈 미흡',
    '기준을 물라 정리정돈 미흡',
    '정리정돈 기준 및 방법이 부적절',
    '기타',
  ],
};

const SAOForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  
  const [formData, setFormData] = useState({
    siteId: user?.siteId || '',
    reportDate: new Date().toISOString().split('T')[0],
    reportTime: new Date().toTimeString().slice(0, 5),
    workplace: '',
    workArea: '',
    workType: '',
    workShift: '',
    observerCount: 1,
    workerCount: 0,
    workResponse: '',
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchSites();
    initializeItems();
    
    if (id) {
      fetchSAOReport();
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
    
    Object.entries(saoTemplate).forEach(([category, questions]) => {
      questions.forEach((question) => {
        itemsList.push({
          category,
          itemNumber: itemNumber++,
          itemText: question,
          checked: false,
          notes: '',
        });
      });
    });
    
    setItems(itemsList);
  };

  const fetchSAOReport = async () => {
    try {
      const data = await saoService.getSAOReport(id!);
      setFormData({
        siteId: data.site.id,
        reportDate: data.reportDate.split('T')[0],
        reportTime: data.reportTime || '',
        workplace: data.workplace,
        workArea: data.workArea,
        workType: data.workType || '',
        workShift: data.workShift || '',
        observerCount: data.observerCount,
        workerCount: data.workerCount,
        workResponse: data.workResponse || '',
      });
      setItems(data.items);
    } catch (error) {
      console.error('Failed to fetch SAO report:', error);
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
        await saoService.updateSAOReport(id, data);
      } else {
        await saoService.createSAOReport(data);
      }

      navigate('/sao');
    } catch (error: any) {
      console.error('Failed to save SAO report:', error);
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
          onClick={() => navigate('/sao')}
          sx={{ mr: 2 }}
        >
          목록
        </Button>
        <Typography variant="h4">
          {id ? 'SAO 수정' : 'SAO 작성'}
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="관찰일"
              type="date"
              value={formData.reportDate}
              onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="시간"
              type="time"
              value={formData.reportTime}
              onChange={(e) => setFormData({ ...formData, reportTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="작업부서명"
              value={formData.workplace}
              onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="관찰지역"
              value={formData.workArea}
              onChange={(e) => setFormData({ ...formData, workArea: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>작업유형</InputLabel>
              <Select
                value={formData.workType}
                onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
              >
                <MenuItem value="">선택</MenuItem>
                <MenuItem value="점검/경비">점검/경비</MenuItem>
                <MenuItem value="공사">공사</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>근무형태</InputLabel>
              <Select
                value={formData.workShift}
                onChange={(e) => setFormData({ ...formData, workShift: e.target.value })}
              >
                <MenuItem value="">선택</MenuItem>
                <MenuItem value="교대">교대</MenuItem>
                <MenuItem value="상주">상주</MenuItem>
                <MenuItem value="하도급">하도급</MenuItem>
                <MenuItem value="별도공사">별도공사</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              label="작업인원"
              type="number"
              value={formData.workerCount}
              onChange={(e) => setFormData({ ...formData, workerCount: parseInt(e.target.value) })}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          관찰 항목
        </Typography>
        
        {Object.keys(saoTemplate).map((category) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', bgcolor: '#f5f5f5', p: 1 }}>
              {category}
            </Typography>
            {items
              .filter((item) => item.category === category)
              .map((item, index) => {
                const actualIndex = items.findIndex((i) => i === item);
                return (
                  <Box key={actualIndex} sx={{ ml: 2, mb: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={item.checked}
                              onChange={(e) => handleItemChange(actualIndex, 'checked', e.target.checked)}
                            />
                          }
                          label={item.itemText}
                        />
                      </Grid>
                      {item.checked && (
                        <Grid item xs={12} md={6}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="상세 내용"
                            value={item.notes || ''}
                            onChange={(e) => handleItemChange(actualIndex, 'notes', e.target.value)}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                );
              })}
          </Box>
        ))}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="작업 대응"
          value={formData.workResponse}
          onChange={(e) => setFormData({ ...formData, workResponse: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate('/sao')}>
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

export default SAOForm;
