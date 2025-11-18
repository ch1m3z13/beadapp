'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

const FormActions = ({ onSubmit, onCancel, isSubmitting, isValid }: FormActionsProps) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex-1 sm:flex-none px-6 py-3 text-muted-foreground bg-muted 
                 hover:bg-muted/80 rounded-lg font-medium transition-smooth
                 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || !isValid}
        className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground 
                 hover:bg-primary/90 rounded-lg font-medium transition-smooth
                 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Icon 
              name="ArrowPathIcon" 
              size={16} 
              className="animate-spin"
            />
            Creating Project...
          </>
        ) : (
          <>
            <Icon name="PlusIcon" size={16} />
            Add Project
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;