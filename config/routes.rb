Rails.application.routes.draw do
  root 'plates#index'
  get '/plates' => 'plates#index'

  namespace :api do
    resources :plates, only: [:index, :show]
    get '/plates_by_day', to: 'plates#plates_by_day'
    get '/plates_by_month', to: 'plates#plates_by_month'
    get '/plates_by_year', to: 'plates#plates_by_year'
    get '/frequency_by_character', to: 'plates#frequency_by_character'
  end
end
