Rails.application.routes.draw do
  get '/plates' => 'plates#index'

  namespace :api do
    resources :plates, only: [:index, :show]
  end
end
