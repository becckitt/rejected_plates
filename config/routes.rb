Rails.application.routes.draw do
  root 'plates#index'
  get '/plates' => 'plates#index'

  namespace :api do
    resources :plates, only: [:index, :show]
    get '/plates_by_month', to: 'plates#plates_by_month'
    get '/frequency_by_character', to: 'plates#frequency_by_character'
  end
end
