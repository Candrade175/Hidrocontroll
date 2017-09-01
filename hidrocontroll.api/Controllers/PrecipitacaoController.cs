using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using hidrocontroll.Models;

namespace hidrocontroll.Controllers
{
    public class PrecipitacaoController : BaseController
    {

        // GET api/Precipitacao
        public IQueryable<CAD_PRECIPITACAO> GetCAD_PRECIPITACAO()
        {
            return db.CAD_PRECIPITACAO;
        }

        // GET api/Precipitacao/5
        [ResponseType(typeof(CAD_PRECIPITACAO))]
        public IHttpActionResult GetCAD_PRECIPITACAO(int id)
        {
            CAD_PRECIPITACAO cad_precipitacao = db.CAD_PRECIPITACAO.Find(id);
            if (cad_precipitacao == null)
            {
                return NotFound();
            }

            return Ok(cad_precipitacao);
        }

        // PUT api/Precipitacao/5
        public IHttpActionResult PutCAD_PRECIPITACAO(int id, CAD_PRECIPITACAO cad_precipitacao)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_precipitacao.IDC_CAD_PRECIPITACAO)
            {
                return BadRequest();
            }

            db.Entry(cad_precipitacao).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_PRECIPITACAOExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            try
            {

                new ManejoController().atualizaManejo(cad_precipitacao.CAD_PARCELA_IDC_CAD_PARCELA, cad_precipitacao.DAT_PRECIPITACAO.Value);
            }
            catch (Exception e)
            {

            }
            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Precipitacao
        [ResponseType(typeof(CAD_PRECIPITACAO))]
        public IHttpActionResult PostCAD_PRECIPITACAO(CAD_PRECIPITACAO cad_precipitacao)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_PRECIPITACAO.Add(cad_precipitacao);
            db.SaveChanges();
            try
            {
                    new ManejoController().atualizaManejo(cad_precipitacao.CAD_PARCELA_IDC_CAD_PARCELA, cad_precipitacao.DAT_PRECIPITACAO.Value);

            }
            catch (Exception e)
            {

            }

            return CreatedAtRoute("DefaultApi", new { id = cad_precipitacao.IDC_CAD_PRECIPITACAO }, cad_precipitacao);
        }

        // DELETE api/Precipitacao/5
        [ResponseType(typeof(CAD_PRECIPITACAO))]
        public IHttpActionResult DeleteCAD_PRECIPITACAO(int id)
        {
            CAD_PRECIPITACAO cad_precipitacao = db.CAD_PRECIPITACAO.Find(id);
            if (cad_precipitacao == null)
            {
                return NotFound();
            }

            db.CAD_PRECIPITACAO.Remove(cad_precipitacao);
            db.SaveChanges();
            try
            {
                new ManejoController().atualizaManejo(cad_precipitacao.CAD_PARCELA_IDC_CAD_PARCELA, cad_precipitacao.DAT_PRECIPITACAO.Value);
            }
            catch (Exception e)
            {

            }

            return Ok(cad_precipitacao);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_PRECIPITACAOExists(int id)
        {
            return db.CAD_PRECIPITACAO.Count(e => e.IDC_CAD_PRECIPITACAO == id) > 0;
        }
    }
}