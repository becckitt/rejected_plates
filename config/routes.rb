Rails.application.routes.draw do
  get '/plates' => 'plates#index'

  namespace :api do
    resources :plates, only: [:index, :show]
    get '/plates_by_month', to: 'plates#plates_by_month'
  end
end
