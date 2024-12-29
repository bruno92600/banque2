import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import React from 'react'
import AddTransictionForm from './_components/transaction-form'
import { getTransaction } from '@/actions/transaction'

const AddtransactionPage = async ({searchParams}) => {

    const accounts = await getUserAccounts()

    const editId = searchParams?.edit

    let initialData = null
    if (editId) {
        const transaction = await getTransaction(editId)
        initialData = transaction
    }

  return (
    <div className='max-w-3xl mx-auto px-5'>
        <h1 className='text-5xl gradient-title mb-8'>{editId ? "modifier une" : "Ajouter une"} transaction</h1>

        <AddTransictionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
        />
    </div>
  )
}

export default AddtransactionPage