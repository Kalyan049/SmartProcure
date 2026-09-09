import React, { useState, useEffect } from 'react';
import { PageContainer, Card, StatusBadge, Button } from '@/components';
import { Search, Eye, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '@/services/api/apiClient';
import { API_ENDPOINTS } from '@/app/config/api.config';
import { QueueEntry } from '@shared/types';

export const OfficerQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [advancing, setAdvancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const centerId = 'ctr-02'; // Static for MVP

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await fetchApi<QueueEntry[]>(API_ENDPOINTS.QUEUE.BY_CENTER(centerId));
      setQueue(res);
      setError(null);
    } catch (err: any) {
      setError('Failed to load queue. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAdvanceQueue = async () => {
    try {
      setAdvancing(true);
      await fetchApi(API_ENDPOINTS.QUEUE.ADVANCE, { method: 'POST', body: JSON.stringify({ centerId }) });
      await fetchQueue(); // Refresh the list
    } catch (err: any) {
      alert('Failed to advance queue: ' + err.message);
    } finally {
      setAdvancing(false);
    }
  };

  const waitingQueue = queue.filter(q => q.status === 'WAITING').sort((a, b) => a.position - b.position);
  const completedQueue = queue.filter(q => q.status === 'COMPLETED');

  return (
    <PageContainer
      title="Live Center Queue Table"
      subtitle="Comprehensive intake roster with real-time token tracking, check-in, and stage status."
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search token, farmer name, mobile or crop..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-surface-input focus:border-brand-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={fetchQueue}>
              Refresh
            </Button>
            <Button 
              size="sm" 
              variant="primary" 
              onClick={handleAdvanceQueue}
              disabled={advancing || waitingQueue.length === 0}
              rightIcon={advancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            >
              Call Next Token
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-600 rounded flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-page text-text-secondary text-xs uppercase font-bold border-y border-surface-border">
              <tr>
                <th className="py-3 px-4">Pos</th>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Est. Wait</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading && queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading Live Queue...
                  </td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    Queue is currently empty.
                  </td>
                </tr>
              ) : (
                <>
                  {/* WAITING LIST */}
                  {waitingQueue.map((entry) => (
                    <tr key={entry.id} className="hover:bg-surface-page transition-colors">
                      <td className="py-3.5 px-4 font-bold text-text-secondary">#{entry.position}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">{entry.token_number}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={entry.status} />
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        {entry.estimated_wait_minutes} min ({entry.farmers_ahead} ahead)
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {entry.position === waitingQueue[0]?.position ? (
                           <Button
                             size="sm"
                             variant="primary"
                             leftIcon={<Eye className="w-3.5 h-3.5" />}
                             onClick={() => navigate('/officer/procurement')}
                           >
                             Process
                           </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Wait
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* COMPLETED LIST */}
                  {completedQueue.length > 0 && (
                    <tr className="bg-surface-page">
                      <td colSpan={5} className="py-2 px-4 text-xs font-bold text-text-secondary uppercase">
                        Recently Completed
                      </td>
                    </tr>
                  )}
                  {completedQueue.map((entry) => (
                    <tr key={entry.id} className="opacity-60 bg-gray-50">
                      <td className="py-3.5 px-4 font-bold text-text-secondary">—</td>
                      <td className="py-3.5 px-4 font-mono text-text-secondary line-through">{entry.token_number}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={entry.status} />
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">—</td>
                      <td className="py-3.5 px-4 text-right">
                         <span className="text-xs text-green-600 font-bold">Done</span>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};
