import React from 'react';
import type { ResumeData } from '../types';
import { Plus, Trash2, GripVertical, Calendar, FileUp } from 'lucide-react';
import type { DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Step3Props {
  data: ResumeData['education'];
  updateData: (data: ResumeData['education']) => void;
}

export const Step3 = ({ data, updateData }: Step3Props) => {
  const handleAdd = () => {
    updateData([
      ...data,
      {
        id: crypto.randomUUID(),
        degree: '',
        school: '',
        graduationDate: '',
        gpa: '',
        fileName: '',
        description: '',
      },
    ]);
  };

  const handleRemove = (id: string) => {
    updateData(data.filter((item) => item.id !== id));
  };

  const handleChange = (id: string, field: keyof ResumeData['education'][0], value: any) => {
    updateData(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange(id, 'fileName', file.name);
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Eğitim ve Sertifikalar</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Eğitim/Sertifika Ekle</span>
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="education-list">
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
                          <label className="block text-sm font-medium text-gray-700">Derece / Sertifika Adı</label>
                          <input
                            type="text"
                            value={item.degree}
                            onChange={(e) => handleChange(item.id, 'degree', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="Bilgisayar Mühendisliği Lisans"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Okul / Kurum</label>
                          <input
                            type="text"
                            value={item.school}
                            onChange={(e) => handleChange(item.id, 'school', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="Üniversite Adı"
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700">Mezuniyet / Alınma Tarihi</label>
                          <div className="relative mt-1">
                            <input
                              type="month"
                              value={item.graduationDate}
                              onChange={(e) => handleChange(item.id, 'graduationDate', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Not Ortalaması (Opsiyonel)</label>
                          <input
                            type="text"
                            value={item.gpa}
                            onChange={(e) => handleChange(item.id, 'gpa', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="3.50 / 4.00"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Belge / Sertifika Yükle</label>
                          <div className="mt-1 flex items-center">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 border border-gray-300 px-4 py-2 flex items-center space-x-2 shadow-sm">
                              <FileUp className="w-5 h-5" />
                              <span>{item.fileName ? 'Belgeyi Değiştir' : 'Belge Seç'}</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(item.id, e)}
                              />
                            </label>
                            {item.fileName && (
                              <span className="ml-3 text-sm text-gray-500 truncate max-w-xs">
                                {item.fileName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Açıklama (Opsiyonel)</label>
                          <textarea
                            rows={3}
                            value={item.description || ''}
                            onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="Sertifika hakkında detaylar veya alınan dersler..."
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