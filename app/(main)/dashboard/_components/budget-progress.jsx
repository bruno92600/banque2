"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { Check, Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { updateBudget } from "@/actions/budget";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const BudgetProgress = ({ initialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updatedBudget,
        error,
      } = useFetch(updateBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget)

    if (isNaN(amount) || amount <= 0) {
      toast.error("Veuillez entrer un montant valide.");
      return;
    }

    await updateBudgetFn(amount)
  };

  

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "")
    setIsEditing(false);
  };

  useEffect(() => {
    if (updateBudget?.success) {
        setIsEditing(false)
        toast.success("Budget mis à jour avec succès.");
    }
  }, [updateBudget])

  useEffect(() => {
    if (error) {
        toast.error(error.message || "Erreur lors de la mise à jour du budget.");
    }
  }, [error])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-x-0 pb-2">
        <div className="flex-1">
        <CardTitle>Budget mensuel (compte par défaut)</CardTitle>
        <div className="flex items-center gap-2 mt-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w32"
                placeholder="Entrer un montant"
                autoFocus
                disabled={isLoading}
              />
              <Button variant="ghost" size="icon" onClick={handleUpdateBudget} disabled={isLoading}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isLoading}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <>
              <CardDescription>
                {initialBudget
                  ? `${currentExpenses.toFixed(
                      2
                    )} € de ${initialBudget.amount.toFixed(2)} dépensé`
                  : "Aucun budget fixé"}
              </CardDescription>
              <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </>
          )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && 
        <div className="space-y-2">
            <Progress 
            value={percentUsed} 
            extraStyles={
                `${percentUsed >= 90 ? "bg-red-500" : percentUsed >= 75 ? "bg-yellow-500" : "bg-green-500"}`
            }
            />
            <p className="text-xs text-muted-foreground text-right">
                {percentUsed.toFixed(1)} % utilisé
            </p>
            </div>}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
