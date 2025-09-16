"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, Apple, Coffee, Clock, Target, TrendingUp, CheckCircle, Plus, Calendar } from "lucide-react"

export default function NutritionPage() {
  const [selectedMeal, setSelectedMeal] = useState(null)

  const meals = [
    {
      id: "MEAL-001",
      name: "CAFÉ DA MANHÃ",
      type: "Primeira refeição",
      status: "completo",
      calories: 485,
      protein: 32,
      carbs: 45,
      fat: 18,
      ingredients: [
        { item: "Banana nanica", quantidade: "1.5 Und. M.", peso: "105g" },
        { item: "Pasta de amendoim integral sem açúcar", quantidade: "0.5 Col. S.", peso: "7.5g" },
        { item: "Aveia flocos crua", quantidade: "0.5 Col. S.", peso: "9g" },
        { item: "Leite de vaca, desnatado, UHT", quantidade: "1 Copo D. CH.", volume: "240ml" },
        { item: "Whey protein (concentrado)", quantidade: "0.75 porção(ões)", peso: "25.5g" },
        { item: "Omega 3", quantidade: "1 Cápsula(s)", peso: "1.7g" },
        { item: "Creatina", quantidade: "1 colher(es) de chá", peso: "5.0g" },
      ],
    },
    {
      id: "MEAL-002",
      name: "COLAÇÃO",
      type: "Lanche matinal",
      status: "pendente",
      calories: 320,
      protein: 18,
      carbs: 28,
      fat: 15,
      ingredients: [
        { item: "Ovo frito/mexido, sem óleo", quantidade: "2 Und. M.", peso: "110g" },
        { item: "Pão francês", quantidade: "1 Unid.", peso: "50g" },
        { item: "Queijo minas, frescal", quantidade: "0.5 Ft. G", peso: "20g" },
        { item: "Requeijão cremoso light", quantidade: "1 Colher(es) de sobremesa", peso: "15.0g" },
      ],
    },
    {
      id: "MEAL-003",
      name: "ALMOÇO",
      type: "Refeição principal",
      status: "pendente",
      calories: 520,
      protein: 35,
      carbs: 55,
      fat: 12,
      ingredients: [
        { item: "Vegetais A ou Folhosos", quantidade: "Consumo Livre" },
        { item: "Vegetais B ou Hortaliças", quantidade: "Consumo Livre" },
        { item: "Frango, peito, filé", quantidade: "1.5 Bife P.", peso: "75g" },
        { item: "Arroz tipo 1 ou 2, cozido", quantidade: "3 Col. S.", peso: "75g" },
        { item: "Feijão carioca (50% grão, 50% caldo)", quantidade: "1 Co. P Ch.", peso: "55g" },
        { item: "Azeite de oliva", quantidade: "0.5 Col. S.", peso: "6g" },
      ],
      observacoes: "Consumir, no mínimo, 120g de Vegetais A+B",
    },
    {
      id: "MEAL-004",
      name: "LANCHE",
      type: "Lanche vespertino",
      status: "pendente",
      calories: 285,
      protein: 15,
      carbs: 22,
      fat: 8,
      ingredients: [
        { item: "Maça Fuji", quantidade: "1 Unid. P.", peso: "100g" },
        { item: "Castanha-de-caju torrada", quantidade: "5 Und.", peso: "10g" },
        { item: "Iogurte natural", quantidade: "1 Und.", volume: "185ml" },
        { item: "Whey protein (concentrado)", quantidade: "0.5 porção(ões)", peso: "17g" },
      ],
    },
    {
      id: "MEAL-005",
      name: "JANTAR",
      type: "Refeição principal",
      status: "pendente",
      calories: 495,
      protein: 32,
      carbs: 52,
      fat: 12,
      ingredients: [
        { item: "Vegetais A ou Folhosos", quantidade: "Consumo Livre" },
        { item: "Vegetais B ou Hortaliças", quantidade: "Consumo Livre" },
        { item: "Patinho, sem gordura, moído", quantidade: "4.5 Col. S.", peso: "67.5g" },
        { item: "Arroz tipo 1 ou 2, cozido", quantidade: "3 Col. S.", peso: "75g" },
        { item: "Feijão carioca (50% grão, 50% caldo)", quantidade: "1 Co. P Ch.", peso: "55g" },
        { item: "Azeite de oliva", quantidade: "0.5 Col. S.", peso: "6g" },
      ],
      observacoes: "Consumir, no mínimo, 120g de Vegetais A+B",
    },
    {
      id: "MEAL-006",
      name: "CEIA",
      type: "Última refeição",
      status: "pendente",
      calories: 425,
      protein: 28,
      carbs: 42,
      fat: 8,
      ingredients: [
        { item: "Banana nanica", quantidade: "1.5 Und. M.", peso: "105g" },
        { item: "Aveia flocos crua", quantidade: "0.5 Col. S.", peso: "9g" },
        { item: "Leite de vaca, desnatado, UHT", quantidade: "1 Copo D. CH.", volume: "240ml" },
        { item: "Whey protein (concentrado)", quantidade: "0.75 porção(ões)", peso: "25.5g" },
        { item: "Omega 3", quantidade: "1 Cápsula(s)", peso: "1.7g" },
      ],
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completo":
        return "bg-white/20 text-white"
      case "pendente":
        return "bg-orange-500/20 text-orange-500"
      case "atrasado":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-neutral-500/20 text-neutral-300"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completo":
        return <CheckCircle className="w-4 h-4" />
      case "pendente":
        return <Clock className="w-4 h-4" />
      case "atrasado":
        return <Target className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getMealIcon = (type) => {
    switch (type) {
      case "Primeira refeição":
        return <Coffee className="w-6 h-6" />
      case "Lanche matinal":
      case "Lanche vespertino":
        return <Apple className="w-6 h-6" />
      case "Refeição principal":
        return <Utensils className="w-6 h-6" />
      case "Última refeição":
        return <Coffee className="w-6 h-6" />
      default:
        return <Utensils className="w-6 h-6" />
    }
  }

  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  const completedMeals = meals.filter((meal) => meal.status === "completo").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">PLANO ALIMENTAR</h1>
          <p className="text-sm text-neutral-400">Controle nutricional e planejamento de refeições</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nova Refeição
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Planejar Semana
          </Button>
        </div>
      </div>

      {/* Daily Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">REFEIÇÕES HOJE</p>
                <p className="text-2xl font-bold text-white font-mono">
                  {completedMeals}/{meals.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CALORIAS TOTAL</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">{dailyTotals.calories}</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">PROTEÍNA (G)</p>
                <p className="text-2xl font-bold text-white font-mono">{dailyTotals.protein}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CARBOIDRATOS (G)</p>
                <p className="text-2xl font-bold text-neutral-300 font-mono">{dailyTotals.carbs}</p>
              </div>
              <Apple className="w-8 h-8 text-neutral-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <Card
            key={meal.id}
            className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedMeal(meal)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getMealIcon(meal.type)}
                  <div>
                    <CardTitle className="text-sm font-bold text-white tracking-wider">{meal.name}</CardTitle>
                    <p className="text-xs text-neutral-400">{meal.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(meal.status)}
                  <Badge className={getStatusColor(meal.status)}>{meal.status.toUpperCase()}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">CALORIAS</span>
                <span className="text-sm font-bold font-mono text-orange-500">{meal.calories} kcal</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-neutral-400 mb-1">PROTEÍNA</div>
                  <div className="text-white font-mono">{meal.protein}g</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(meal.protein / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400 mb-1">CARBOIDRATOS</div>
                  <div className="text-white font-mono">{meal.carbs}g</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(meal.carbs / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400 mb-1">GORDURA</div>
                  <div className="text-white font-mono">{meal.fat}g</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(meal.fat / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Ingredientes:</span>
                  <span className="text-white font-mono">{meal.ingredients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-white">{meal.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {getMealIcon(selectedMeal.type)}
                <div>
                  <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedMeal.name}</CardTitle>
                  <p className="text-sm text-neutral-400">
                    {selectedMeal.id} • {selectedMeal.type}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedMeal(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">STATUS DA REFEIÇÃO</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedMeal.status)}
                      <Badge className={getStatusColor(selectedMeal.status)}>{selectedMeal.status.toUpperCase()}</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                      INFORMAÇÕES NUTRICIONAIS
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Calorias:</span>
                        <span className="text-orange-500 font-mono">{selectedMeal.calories} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Proteína:</span>
                        <span className="text-white font-mono">{selectedMeal.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Carboidratos:</span>
                        <span className="text-white font-mono">{selectedMeal.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Gordura:</span>
                        <span className="text-white font-mono">{selectedMeal.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">INGREDIENTES</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedMeal.ingredients.map((ingredient, index) => (
                        <div key={index} className="bg-neutral-800 p-3 rounded-lg">
                          <div className="text-sm text-white font-medium">{ingredient.item}</div>
                          <div className="text-xs text-neutral-400 mt-1">
                            {ingredient.quantidade}
                            {ingredient.peso && ` • ${ingredient.peso}`}
                            {ingredient.volume && ` • ${ingredient.volume}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedMeal.observacoes && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-orange-500 mb-2">OBSERVAÇÕES</h4>
                  <p className="text-sm text-neutral-300">{selectedMeal.observacoes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Marcar como Completo</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Editar Refeição
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Duplicar para Amanhã
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
