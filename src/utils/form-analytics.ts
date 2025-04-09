
// Simple form analytics helper functions
export interface FormAnalytics {
  views: number;
  submissions: number;
  averageCompletionTime?: number;
  completionRate?: number;
}

// Initialize analytics for a form
export const initFormAnalytics = (formId: string): FormAnalytics => {
  const storedAnalytics = localStorage.getItem(`form_analytics_${formId}`);
  
  if (storedAnalytics) {
    return JSON.parse(storedAnalytics);
  }
  
  const newAnalytics: FormAnalytics = {
    views: 0,
    submissions: 0,
  };
  
  localStorage.setItem(`form_analytics_${formId}`, JSON.stringify(newAnalytics));
  return newAnalytics;
};

// Record a form view
export const recordFormView = (formId: string): void => {
  const analytics = initFormAnalytics(formId);
  analytics.views += 1;
  localStorage.setItem(`form_analytics_${formId}`, JSON.stringify(analytics));
};

// Record a form submission
export const recordFormSubmission = (formId: string): void => {
  const analytics = initFormAnalytics(formId);
  analytics.submissions += 1;
  
  // Calculate completion rate
  if (analytics.views > 0) {
    analytics.completionRate = (analytics.submissions / analytics.views) * 100;
  }
  
  localStorage.setItem(`form_analytics_${formId}`, JSON.stringify(analytics));
};

// Get form analytics
export const getFormAnalytics = (formId: string): FormAnalytics => {
  return initFormAnalytics(formId);
};
