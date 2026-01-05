import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useVacancyStore } from '@/stores/vacancyStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

const vacancySchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100, 'Título muy largo'),
  company: z.string().min(2, 'La empresa es requerida').max(100, 'Nombre muy largo'),
  location: z.string().min(2, 'La ubicación es requerida').max(100, 'Ubicación muy larga'),
  modality: z.enum(['remote', 'hybrid', 'onsite']),
  salaryRange: z.string().min(1, 'El rango salarial es requerido'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres').max(2000, 'Descripción muy larga'),
  seniority: z.string().min(1, 'El nivel de seniority es requerido'),
  maxApplicants: z.coerce.number().min(1, 'Debe permitir al menos 1 aplicante').max(100, 'Máximo 100 aplicantes'),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

export default function EditVacancy() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedVacancy, fetchVacancyById, updateVacancy, isLoading } = useVacancyStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
  });

  useEffect(() => {
    if (id) {
      fetchVacancyById(id);
    }
  }, [id, fetchVacancyById]);

  useEffect(() => {
    if (selectedVacancy) {
      reset({
        title: selectedVacancy.title,
        company: selectedVacancy.company,
        location: selectedVacancy.location,
        modality: selectedVacancy.type,
        salaryRange: selectedVacancy.salary.range || '',
        description: selectedVacancy.description,
        seniority: selectedVacancy.seniority || 'Semi Senior',
        maxApplicants: selectedVacancy.maxApplicants || 10,
      });
      
      setRequirements(selectedVacancy.requirements.length > 0 ? selectedVacancy.requirements : ['']);
      setBenefits(selectedVacancy.benefits.length > 0 ? selectedVacancy.benefits : ['']);
    }
  }, [selectedVacancy, reset]);

  const handleAddRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const onSubmit = async (data: VacancyFormData) => {
    if (!user || !id) return;

    const filteredRequirements = requirements.filter((r) => r.trim() !== '');
    const filteredBenefits = benefits.filter((b) => b.trim() !== '');

    if (filteredRequirements.length === 0) {
      toast({
        title: 'Error',
        description: 'Agrega al menos un requisito',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateVacancy(id, {
        title: data.title,
        description: data.description,
        technologies: filteredRequirements.join(', '),
        seniority: data.seniority,
        softSkills: filteredBenefits.join(', '),
        location: data.location,
        modality: data.modality,
        salaryRange: data.salaryRange,
        company: data.company,
        maxApplicants: data.maxApplicants,
      });

      toast({
        title: '¡Vacante actualizada!',
        description: 'La vacante ha sido actualizada exitosamente.',
      });

      navigate(`/dashboard/vacancies/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la vacante. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading || !selectedVacancy) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
        <div className="bg-card rounded-2xl p-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Editar Vacante
        </h1>
        <p className="text-muted-foreground">
          Actualiza la información de la vacante.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border/50 space-y-6"
      >
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Información Básica</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del puesto</Label>
              <Input
                id="title"
                placeholder="Ej: Senior Frontend Developer"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                placeholder="Nombre de la empresa"
                {...register('company')}
              />
              {errors.company && (
                <p className="text-sm text-destructive">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                placeholder="Ej: Ciudad de México"
                {...register('location')}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modality">Modalidad</Label>
              <select
                id="modality"
                {...register('modality')}
                className="w-full h-11 px-3 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary"
              >
                <option value="remote">Remoto</option>
                <option value="hybrid">Híbrido</option>
                <option value="onsite">Presencial</option>
              </select>
              {errors.modality && (
                <p className="text-sm text-destructive">{errors.modality.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Salary and Details */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground">Detalles del Puesto</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryRange">Rango Salarial</Label>
              <Input
                id="salaryRange"
                placeholder="$3,000,000 - $4,500,000 COP"
                {...register('salaryRange')}
              />
              {errors.salaryRange && (
                <p className="text-sm text-destructive">{errors.salaryRange.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seniority">Nivel de Seniority</Label>
              <select
                id="seniority"
                {...register('seniority')}
                className="w-full h-11 px-3 rounded-lg bg-background border border-input focus:ring-2 focus:ring-primary"
              >
                <option value="Junior">Junior</option>
                <option value="Semi Senior">Semi Senior</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
              {errors.seniority && (
                <p className="text-sm text-destructive">{errors.seniority.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxApplicants">Máximo de Aplicantes</Label>
            <Input
              id="maxApplicants"
              type="number"
              placeholder="10"
              {...register('maxApplicants')}
            />
            {errors.maxApplicants && (
              <p className="text-sm text-destructive">{errors.maxApplicants.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground">Descripción</h2>
          
          <div className="space-y-2">
            <Label htmlFor="description">Describe el puesto</Label>
            <Textarea
              id="description"
              placeholder="Describe las responsabilidades, el equipo, la cultura de la empresa..."
              rows={6}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Requisitos</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddRequirement}>
              <Plus className="w-4 h-4 mr-1" />
              Agregar
            </Button>
          </div>
          
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder="Ej: 3+ años de experiencia en React"
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Beneficios</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddBenefit}>
              <Plus className="w-4 h-4 mr-1" />
              Agregar
            </Button>
          </div>
          
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder="Ej: Seguro médico"
                />
                {benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBenefit(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Actualizando...' : 'Actualizar Vacante'}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}