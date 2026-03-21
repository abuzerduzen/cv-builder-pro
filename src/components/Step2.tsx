import type { ResumeData } from '../types';
import { Plus, Trash2, GripVertical, Calendar } from 'lucide-react';
import type { DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Step2Props {
  data: ResumeData['experience'];
  updateData: (data: ResumeData['experience']) => void;
}

export const Step2 = ({ data, updateData }: Step2Props) => {
  const handleAdd = () => {
    updateData([
      ...data,
      {
        id: crypto.randomUUID(),
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ]);
  };

  const handleRemove = (id: string) => {
    updateData(data.filter((item) => item.id !== id));
  };

  const handleChange = (id: string, field: keyof ResumeData['experience'][0], value: any) => {
    updateData(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateData(items);
  };

  // @ts-ignore
  const DraggableComponent = Draggable as any;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">İş Deneyimi</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Deneyim Ekle</span>
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="experience-list">
          {(provided: DroppableProvided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              {data.map((item, index) => {
                return (
                <DraggableComponent key={item.id} draggableId={item.id} index={index}>
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white p-6 rounded-lg border shadow-sm ${
                        snapshot.isDragging ? 'border-blue-500 shadow-md' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                          <input
                            type="text"
                            value={item.jobTitle}
                            onChange={(e) => handleChange(item.id, 'jobTitle', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="Yazılım Geliştirici"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Şirket</label>
                          <input
                            type="text"
                            value={item.company}
                            onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="Tech Corp"
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
                          <div className="relative mt-1">
                            <input
                              type="month"
                              value={item.startDate}
                              onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
                          <div className="relative mt-1">
                            <input
                              type="month"
                              value={item.endDate}
                              disabled={item.current}
                              onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border pl-10 ${
                                item.current ? 'bg-gray-100 text-gray-500' : ''
                              }`}
                            />
                            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${item.current ? 'text-gray-400' : 'text-blue-500'}`} />
                          </div>
                          <div className="mt-2 flex items-center">
                            <input
                              type="checkbox"
                              id={`current-${item.id}`}
                              checked={item.current}
                              onChange={(e) => handleChange(item.id, 'current', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`current-${item.id}`} className="ml-2 block text-sm text-gray-900">
                              Hala çalışıyorum
                            </label>
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                          <textarea
                            rows={4}
                            value={item.description}
                            onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="Projedeki rolünüz, başarılarınız..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </DraggableComponent>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
